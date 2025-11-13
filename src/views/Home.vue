<template>
    <div class="d-flex justify-center align-center">
        <div class="h-screen bg-bgColor relative overflow-y-auto" :style="mdAndUp ? 'width: 400px; max-width: 500px;' : 'width: 100%;'">
            <div class="pt-1">
                <v-carousel 
                    v-model="currentSlide"
                    cycle 
                    :show-arrows="false" 
                    hide-delimiters
                    hide-delimiter-background
                    class="w-full"
                >
                    <v-carousel-item
                        v-for="banner in banners"
                        :key="banner.id"
                    >
                        <v-img :src="banner.src" class="w-full" style="max-width: 100%; height: auto;"></v-img>
                    </v-carousel-item>
                </v-carousel>

                <div class="d-flex justify-center">
                    <div 
                        v-for="(banner, index) in banners" :key="banner.id"
                        style="height: 10px; width: 10px; border-radius: 50%;"
                        :style="`${banner.id == 2 ? 'margin: 0 5px' : ''}`"
                        :class="currentSlide == index ? 'bg-primary' : 'bg-grey'"
                    ></div>
                </div>
                
                <div v-if="getPlatform() === 'web'">
                    <div class="px-3 mt-3">
                        <v-btn size="x-large" rounded="lg" block color="primary" @click="downloadANROID">
                            <v-icon class="mr-2">mdi-android</v-icon> 下载安卓版
                        </v-btn>
                    </div>
                    <div class="px-3 mt-3">
                        <v-btn size="x-large" rounded="lg" block color="primary" @click="downloadIOS">
                            <v-icon class="mr-2">mdi-apple</v-icon>下载苹果版
                        </v-btn>
                    </div>
                </div>
                <div v-if="getPlatform() === 'ios'">
                    <div class="px-3 mt-3">
                        <v-btn size="x-large" rounded="lg" block color="primary" @click="downloadIOS">下载 APP</v-btn>
                    </div>
                </div>
                <div v-if="getPlatform() === 'android'">
                    <div class="px-3 mt-3">
                        <v-btn size="x-large" rounded="lg" block color="primary" @click="downloadANROID">下载 APP</v-btn>
                    </div>
                </div>
                <div class="px-3 mt-3">
                    <v-btn size="x-large" rounded="lg" block color="primary" class="relative" style="height: 50px;" @click="startGame">
                        <div class="ribbon-wrap">
                            <div class="ribbon">网页版</div>
                        </div>
                        开始游戏
                    </v-btn>
                </div>

                <div class="pa-3 mt-3">
                    <v-img :src="Promotion"></v-img>
                </div>
            </div>

            <v-container v-if="getPlatform() === 'ios'" class="mb-5">
                <div class="my-5 font-weight-bold">iOS 安装指南</div>
                <v-row>
                    <v-col
                        v-for="(guide, index) in guides" :key="guides.id"
                        cols="6"
                    >
                       <v-img :src="guide.src" class="border rounded-lg bg-white" @click="selectedImageIndex = index; dialog = true;"></v-img>
                    </v-col>
                </v-row>
            </v-container>

            <div
                ref="draggableBtn"
                class="draggable-btn"
                @click="goToService"
                @mousedown="startDrag"
                @touchstart="startDrag"
                :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
            >
                <div class="font-weight-bold" style="font-size: 14px;">7x24小时</div>
                <div style="font-size: 12px; text-align: center;">在线客服</div>
                <div class="bg-red rounded-xl text-center py-1 mt-1" style="font-size: 10px;">点击咨询</div>
            </div>
        </div>

        <v-dialog
            v-model="dialog"
            fullscreen
            transition="dialog-bottom-transition"
        >
            <v-card class="pa-0">
                <v-card-title class="d-flex justify-end">
                    <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
                </v-card-title>
                <v-card-text class="pa-0">
                    <v-img :src="guides[selectedImageIndex].src" class="bg-white w-full"></v-img>
                    <div class="d-flex justify-center mt-5">
                        <v-btn icon="mdi-chevron-left" class="mr-3" color="primary" variant="tonal" @click="previousImage" :disabled="selectedImageIndex == 0"></v-btn>
                        <v-btn icon="mdi-chevron-right" color="primary" variant="tonal" @click="nextImage" :disabled="selectedImageIndex == guides.length - 1"></v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Banner1 from '@/assets/banner1.png';
import Banner2 from '@/assets/banner2.png';
import Banner3 from '@/assets/banner3.png';
import Step1 from '@/assets/step1.png';
import Step2 from '@/assets/step2.png';
import Step3 from '@/assets/step3.png';
import Step4 from '@/assets/step4.png';
import Promotion from '@/assets/promotion.png';
import { useDisplay } from 'vuetify';
import { GET_DOMAIN } from '../js/api';
const { mdAndUp } = useDisplay();
import CryptoJS from 'crypto-js';

const domains = ref([]);
const currentSlide = ref(0)
const banners = ref([
    { id: 1, src: Banner1 },
    { id: 2, src: Banner2 },
    { id: 3, src: Banner3 },
]);
const guides = ref([
    { id: 1, src: Step1 },
    { id: 2, src: Step2 },
    { id: 3, src: Step3 },
    { id: 3, src: Step4 },
]);
const draggableBtn = ref(null)
const pos = reactive({ x: 0, y: 0 }) // initial position
const drag = reactive({
    active: false,
    offsetX: 0,
    offsetY: 0,
    moved: false, // 👈 detect movement
    startX: 0,
    startY: 0,
})
const dialog = ref(false);
const selectedImageIndex = ref(0);

const previousImage = () => {
    if(selectedImageIndex.value > 0) {
        selectedImageIndex.value --;
    }
}

const nextImage = () => {
    if(selectedImageIndex.value < guides.value.length - 1) {
        selectedImageIndex.value ++;
    }
}

function startDrag(e) {
    drag.active = true
    drag.moved = false

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY

    drag.startX = clientX
    drag.startY = clientY
    drag.offsetX = clientX - pos.x
    drag.offsetY = clientY - pos.y

    e.preventDefault()

    window.addEventListener('mousemove', onDrag, { passive: false })
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', onDrag, { passive: false })
    window.addEventListener('touchend', stopDrag)
}

function onDrag(e) {
    if (!drag.active) return
    e.preventDefault()

    const clientX = e.type.includes('touch')
        ? e.touches[0].clientX
        : e.clientX
    const clientY = e.type.includes('touch')
        ? e.touches[0].clientY
        : e.clientY

    const dx = clientX - drag.startX
    const dy = clientY - drag.startY
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) drag.moved = true

    const button = draggableBtn.value
    if (!button) return

    const buttonWidth = button.offsetWidth
    const buttonHeight = button.offsetHeight

    // Restrict movement so the button stays fully visible
    const minX = 10 // padding from left
    const minY = 10 // padding from top
    const maxX = window.innerWidth - buttonWidth - 15 // right edge padding
    const maxY = window.innerHeight - buttonHeight - 10 // bottom edge padding

    // Apply clamped coordinates
    pos.x = Math.min(Math.max(clientX - drag.offsetX, minX), maxX)
    pos.y = Math.min(Math.max(clientY - drag.offsetY, minY), maxY)
}

function stopDrag(e) {
    // 🧩 Only trigger click if the user didn’t really move
    if (!drag.moved) {
        let target = e.target
        if (target && typeof target.click === 'function') {
            target.click()
        }
    }

    drag.active = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onDrag)
    window.removeEventListener('touchend', stopDrag)
}

const encodeBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

const decodeBase64 = (base64) => {
  return decodeURIComponent(escape(atob(base64)));
};

function getPlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        return 'ios';
    }

    // Android detection
    if (/android/i.test(ua)) {
        return 'android';
    }

    // Fallback: assume web
    return 'web';
}

const downloadIOS = () => {
    const link = document.createElement('a');
    link.href = '/uploads/hj.mobileconfig';
    link.download = 'huangjia.mobileconfig';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  
}

const downloadANROID = () => {
    const link = document.createElement('a');
    link.href = '/uploads/hj.apk';
    link.download = 'huangjia.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  
}

const startGame = () => {
    const randomIndex = Math.floor(Math.random() * domains.value.length);
    const selectedDomain = domains.value[randomIndex];

    // console.log(selectedDomain);
    // const encoded = encodeBase64(selectedDomain);
    // console.log("Encode:", encoded);

    const decoded = decodeBase64(selectedDomain);
    // console.log('Decode:', decoded);
    
    window.open(decoded, '_blank');
}

const goToService = () => {
    const timestamp = (new Date).getTime();
    const md5 = CryptoJS.MD5(String(timestamp)).toString(CryptoJS.enc.Hex).toLowerCase();
    const url = 'https://www.hjkf25.xyz/#/?visiter_id=&avatar=&business_id=307&groupid=1&special=1002&nick_name=';
    const serviceURL = `${url}&t=${timestamp}&sign=${md5}`;
    window.open(serviceURL, '_blank');
}

const getDomains = async () => {
    const res = await GET_DOMAIN();
    if(res.code == 1000) {
        domains.value = res.data;
    }
}

onMounted(() => {
    getDomains();
    const btn = draggableBtn.value
    if (btn) {
        const rect = btn.getBoundingClientRect()
        pos.x = window.innerWidth - rect.width - 15
        pos.y = (window.innerHeight - rect.height) / 2
    }
})
</script>

<style scoped>

.draggable-btn {
    position: absolute;
    cursor: grab;
    z-index: 10;
    padding: 5px;
    border-radius: 10%;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 1px solid #2758bf70;
    text-align: center;
}

.ribbon-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  height: 70px;
  overflow: hidden;
  pointer-events: none; /* make sure it doesn't block button clicks */
}

.ribbon {
  position: absolute;
  display: block;
  width: 100px;
  padding: 2px 0;
  background: linear-gradient(45deg, #ff9800, #ffcc00);
  color: white;
  font-size: 8px;
  font-weight: bold;
  text-align: center;
  transform: rotate(-40deg);
  top: 10px;
  left: -30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>