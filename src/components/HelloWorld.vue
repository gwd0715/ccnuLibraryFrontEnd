<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import SideNav from './SideNav.vue';

const axios_instance = axios.create({
  baseURL: '/v1'
})
const timer = ref<number>(0)
const startTime = ref<string>('')
const endTime = ref<string>('')
const reserveState = ref<boolean>(false)
const state = ref('当前预约状态')
const logEvent = ref<string[]>([])

let hour = ref<number | string>(0)
let min = ref<number | string>(0)
let sec = ref<number | string>(0)
let listener: EventSource
let intervalId: number

onMounted(async () => {
  await checkReserveState()
})

hour = computed<number | string>(() => {
  const h = Math.floor(timer.value / 3600)
  return h < 10 ? '0' + h : h
})

min = computed<number | string>(() => {
  const m = Math.floor((timer.value % 3600) / 60)
  return m < 10 ? '0' + m : m
})

sec = computed<number | string>(() => {
  const s = Math.floor((timer.value % 60))
  return s < 10 ? '0' + s : s
})

window.onbeforeunload = () => {
  if (listener && listener.readyState != 2) listener.close()
}

watch(reserveState, async (newVal) => {
  if (newVal) {
    const now = new Date();
    const nowStamp = now.getTime();
    if (now.getHours() > 18) now.setDate(now.getDate() + 1)
    now.setHours(18);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    timer.value = Math.floor((now.getTime() - nowStamp) / 1000);
    if (timer.value > 0) {
      intervalId = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) clearInterval(intervalId);
      }, 1000);
    }
    await startListen()
  } else {
    clearInterval(intervalId)
    timer.value = 0
    if (listener && listener.readyState != 2) listener.close()
  }
})

const startListen = async () => {
  return await new Promise((resolve, reject) => {
    if (listener && listener.readyState != 2) {
      return resolve('listen existed')
    }
    listener = new EventSource('/v1/events/listenLog')
    listener.onmessage = ({ data }) => {
      logEvent.value.push(data)
      if (data == '所有请求处理完毕') {
        listener.close()
        reserveState.value = false
      }
    }
    listener.onerror = () => {
      alert('接受服务器消息失败')
      if (listener && listener.readyState != 2) listener.close()
      reject('failed')
    }
    listener.onopen = () => {
      resolve('listen startetd')
    }
  })
}

const validateTime = (): boolean => {
  const startCopy = Number(startTime.value.split(':').join(''))
  const endCopy = Number(endTime.value.split(':').join(''))
  if (startCopy == 0 || endCopy == 0) {
    alert('预约时间不能为空')
    return false
  }
  if (new Date().getDay() == 4 && endCopy > 1400) {
    alert('周五下午2点后闭馆')
    return false
  }
  return true
}

const checkReserveState = async () => {
  const res = await axios_instance.get('/reserve/state')
  if (res.data.msg == '已有预约进行中') {
    reserveState.value = true
    state.value = '预约进行中'
  } else {
    reserveState.value = false
    state.value = '当前无预约'
  }
}
const submit = async () => {
  if (validateTime()) {
    //send reserve post request
    await startListen()
    reserveState.value = true
    const res = await axios_instance({
      method: 'post',
      url: "/reserve",
      data: {
        start: startTime.value,
        end: endTime.value
      }
    })
    console.log(res.data.msg)
    state.value = res.data.msg
  }
}
const cancle = async () => {
  if (reserveState.value == true) {
    if (listener && listener.readyState != 2) listener.close()
    const res = await axios_instance({
      method: 'delete',
      url: "/reserve"
    })
    reserveState.value = false
    logEvent.value = []
    state.value = '预约已取消'
  } else {
    alert('当前无预约')
  }
}
</script>

<template>
  <section class="bg">
    <SideNav :messages="logEvent"></SideNav>
    <h1 class="md:mt-32 mt-16 md:text-4xl font-bold text-black font-sourceserif font-bold text-3xl">尊贵的周静SAMA</h1>
    <div class="mt-12 md:mt-28 text-xl md:text-2xl text-black font-fzss">{{ state }}</div>
    <div class="mt-4 md:text-4xl text-2xl font-sans font-semibold">{{ hour }}:{{ min }}:{{ sec }}</div>
    <div class="md:mt-28 mt-12 md:h-8 flex md:flex-row justify-center flex-nowrap flex-col">
      <div class="flex flex-col items-center md:flex-row md:justify-center">
        <el-time-select v-model="startTime" :max-time="endTime" class="md:mr-4 mb-8 md:mb-0 drop-shadow-lg w-36"
          placeholder="Start time" start="08:00" step="00:15" end="22:00" />
        <el-time-select v-model="endTime" :min-time="startTime" placeholder="End time" start="09:00" step="00:15"
          class="drop-shadow-xl w-36 md:mr-8" end="22:00" />
      </div>
      <div class="mt-12 md:mt-0 h-8">
        <button class="mr-8 text-sky-700 btns font-bold" :disabled="reserveState" @click="submit">开始预约</button>
        <button class="text-red-500 font-bold btns" @click="cancle">取消预约</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg {
  width: 100%;
  height: 100vh;
  /* background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB); */
  background-color: #ebecf0;
  background-size: 400% 400%;
  position: relative;
  padding-top: 4rem;
  overflow: hidden;
}

.log {
  border: 0;
  outline: 0;
  border-radius: 20px;
  background-color: #ebecf0;
  /* box-shadow: inset -5px -5px 10px #fff, inset 5px 5px 10px #babecc;  */
}

.btns {
  border: 0;
  outline: 0;
  border-radius: 20px;
  width: 6rem;
  height: 100%;
  font-family: sans-serif;
  font-size: 14px;
  background-color: #ebecf0;
  box-shadow: -5px -5px 10px #fff, 5px 5px 10px #babecc;
  cursor: pointer;
}

.btns:hover:enabled {
  box-shadow: -2px -2px 5px #fff, 2px 2px 5px #babecc;
}

.btns:active:enabled {
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #fff;
}

.btns:disabled {
  cursor: not-allowed;
}
</style>
