<script setup lang="ts">

type Props = {
    messages: string[]
}

defineProps<Props>()
</script>
<template>
    <input type="checkbox" name="" id="check" class="peer md:checked:right-[24.2rem] checked:right-[calc(100vw_-_3.8rem)] absolute z-[4001] w-8 h-8 md:top-8 top-4 right-1 opacity-0 cursor-pointer duration-300">
    <div class="absolute z-[4000] h-screen w-10 bg-gray-400 right-0 top-0 duration-300 md:peer-checked:-translate-x-96 peer-checked:-translate-x-[calc(100vw_-_4rem)]">
        <div class="flex items-center justify-center md:mt-8 mt-4">
            <div class="w-8 h-8 flex items-center justify-center">
                <div class="last w-6 h-[3px] peer-checked:w-8 bg-white rounded-lg relative duration-300
                after:content-[''] after:translate-y-2 after:left-0 after:bg-white after:absolute after:rounded-lg after:duration-300
                after:h-[inherit] after:w-[inherit] before:-translate-y-2 before:left-0 before:absolute before:h-[inherit] before:w-[inherit]
                before:bg-white before:rounded-lg before:content-[''] before:duration-300">
                </div>
            </div>
        </div>
        <div class="h-screen md:w-96 w-[calc(100vw_-_4rem)] absolute bg-gray-500 py-5 px-4 text-white translate-x-10 top-0 overflow-scroll">
            <li class="list-none mt-5 mb-5 text-center font-fzss font-bold text-xl">服务器消息</li>
            <li class="list-none text-left font-fzss font-bold" v-for="(message, index) in messages" :key="index">{{index +1}}. {{message}}</li>
        </div>
    </div>
</template>
<style scoped>
#check {
    -webkit-tap-highlight-color: transparent;
}

#check:checked+div .last {
    background: transparent;
}

#check:checked+div .last::before {
    transform: translateY(0) rotate(45deg);
}

#check:checked+div .last::after {
    transform: translateY(0) rotate(-45deg);
}

/* #check:checked+div {
    transform: translateX(-24rem);
} */
</style>