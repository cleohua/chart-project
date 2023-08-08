//天氣

var template = /*html*/ `
<div 
    id="weather-card"
    class="card"
>
    <div class="title-text">現在天氣</div>
    <div
        class="station"
    >
        <div class="date-time">
            <div class="new-date">{{newDate}}</div>
            <div class="new-time">{{getNewTime}}</div>
        </div>
        <div class="location-area">
            <div class="location">{{location}}</div>
            <div class="location-icon">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0L0 4.18333V4.72778L3.8 6.2L5.26667 10H5.81111L10 0Z" fill="#AAAAAA"/>
                </svg>
            </div>
            
        </div>
        
    </div>
    <div 
        class="temperature-area"
    >
        <div class="temperature-num">{{temperature}}°C</div>
    </div>
    <div class="weather-icon">
        <div
            class="rain"
            v-if="weather == 'rain'"
            style="text-align: center;"
        >
            <svg 
                width="143" 
                height="143" 
                viewBox="0 0 143 143" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
            >
                <path d="M51.1144 103.8L51.1168 103.802C53.0309 104.896 53.6954 107.327 52.6079 109.206L52.6065 109.208L43.6692 124.849L42.725 126.501C42.725 126.501 42.7249 126.502 42.7249 126.502C41.9784 127.795 40.6377 128.514 39.276 128.514C38.5805 128.514 38.0742 128.426 37.471 128.088L37.4705 128.087C35.5649 127.023 34.893 124.595 35.9851 122.683L35.9874 122.679L45.7119 105.289C46.8038 103.354 49.2323 102.711 51.1144 103.8ZM77.9262 103.8L77.9287 103.802C79.8428 104.896 80.5073 107.327 79.4198 109.206L79.4184 109.208L61.5448 140.488C61.5448 140.488 61.5448 140.488 61.5447 140.488C60.7983 141.782 59.4576 142.5 58.0958 142.5C57.4293 142.5 56.7591 142.327 56.1337 141.977L56.1332 141.977C54.2275 140.913 53.5557 138.484 54.6478 136.573L72.5224 105.292L72.5237 105.289C73.6156 103.354 76.0441 102.711 77.9262 103.8ZM24.3025 103.8L24.305 103.802C26.2191 104.896 26.8836 107.327 25.7961 109.206L25.7947 109.208L7.92111 140.488C7.17473 141.782 5.83391 142.5 4.47207 142.5C3.8056 142.5 3.13539 142.327 2.50998 141.977L2.50947 141.977C0.603786 140.913 -0.0680426 138.484 1.02406 136.573L18.8986 105.292L18.9 105.289C19.9919 103.354 22.4204 102.711 24.3025 103.8ZM131.55 103.8L131.552 103.802C133.467 104.896 134.131 107.327 133.043 109.206L133.042 109.208L115.169 140.488C115.169 140.488 115.168 140.488 115.168 140.488C114.422 141.782 113.081 142.5 111.72 142.5C111.053 142.5 110.383 142.327 109.757 141.977L109.757 141.977C107.851 140.913 107.179 138.484 108.271 136.573L126.146 105.292L126.147 105.289C127.239 103.354 129.668 102.711 131.55 103.8ZM104.738 103.8L104.741 103.802C106.654 104.895 107.318 107.325 106.233 109.203C106.233 109.204 106.232 109.205 106.232 109.206L95.6338 126.891L95.6337 126.891L95.6296 126.898C94.8832 128.192 93.5424 128.91 92.1805 128.91C91.8911 128.91 91.4664 128.81 90.9983 128.643C90.5412 128.48 90.0904 128.27 89.7658 128.088L89.7653 128.087C87.8629 127.025 87.1901 124.603 88.2741 122.693L99.3221 105.312L99.3291 105.301L99.3356 105.289C100.427 103.354 102.856 102.711 104.738 103.8ZM115.252 35.7024L115.124 36.3059H115.741C115.858 36.3059 115.969 36.2844 116.032 36.2721L116.048 36.2691C116.122 36.255 116.157 36.25 116.188 36.25C130.714 36.25 142.5 48.0359 142.5 62.5625C142.5 77.0891 130.714 88.875 116.188 88.875H26.8153C12.2891 88.875 0.50343 77.0891 0.50343 62.5625C0.50343 50.9182 8.11957 41.1321 18.6208 37.6773L19.037 37.5404L18.9559 37.1098C18.5973 35.2067 18.378 33.2831 18.378 31.2812C18.378 14.2692 32.1742 0.5 49.1585 0.5C61.0536 0.5 71.2498 7.31204 76.364 17.2108L76.7085 17.8774L77.1911 17.3028C81.2091 12.5194 87.1333 9.4375 93.8449 9.4375C105.913 9.4375 115.688 19.2125 115.688 31.2812C115.688 32.8156 115.551 34.2887 115.252 35.7024Z" fill="#AAAAAA" stroke="none"/>
            </svg>
        </div>
        
        <div 
            class="sun"
            v-if="weather == 'sun'"
            style="text-align: center;"
        >
            <svg 
                width="143" 
                height="143" 
                viewBox="0 0 143 143" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
            
            >
                <path d="M76.2024 26.1522C74.9552 27.3993 73.2638 28.0999 71.5001 28.0999C69.7364 28.0999 68.045 27.3993 66.7978 26.1522C65.5507 24.9051 64.8501 23.2136 64.8501 21.4499V7.14994C64.8501 5.38625 65.5507 3.6948 66.7978 2.44768C68.045 1.20056 69.7364 0.499939 71.5001 0.499939C73.2638 0.499939 74.9552 1.20056 76.2024 2.44768C77.4495 3.6948 78.1501 5.38625 78.1501 7.14994V21.4499C78.1501 23.2136 77.4495 24.9051 76.2024 26.1522Z" fill="#F9C915" stroke="none"/>
                <path d="M121.55 64.85H135.85C137.614 64.85 139.305 65.5506 140.552 66.7977C141.799 68.0448 142.5 69.7363 142.5 71.5C142.5 73.2637 141.799 74.9551 140.552 76.2022C139.305 77.4494 137.614 78.15 135.85 78.15H121.55C119.786 78.15 118.095 77.4494 116.848 76.2022C115.601 74.9551 114.9 73.2637 114.9 71.5C114.9 69.7363 115.601 68.0448 116.848 66.7977C118.095 65.5506 119.786 64.85 121.55 64.85Z" fill="#F9C915" stroke="none"/>
                <path d="M26.1523 66.7977C27.3994 68.0448 28.1 69.7363 28.1 71.5C28.1 73.2637 27.3994 74.9551 26.1523 76.2022C24.9051 77.4494 23.2137 78.15 21.45 78.15H7.15C5.38631 78.15 3.69486 77.4494 2.44774 76.2022C1.20062 74.9551 0.5 73.2637 0.5 71.5C0.5 69.7363 1.20062 68.0448 2.44774 66.7977C3.69486 65.5506 5.38631 64.85 7.15 64.85H21.45C23.2137 64.85 24.9051 65.5506 26.1523 66.7977Z" fill="#F9C915" stroke="none"/>
                <path d="M20.5816 31.6008L20.5816 31.6008L30.8776 41.5393L30.8777 41.5393C31.5203 42.1598 32.2813 42.6445 33.1154 42.9644C33.9494 43.2843 34.8394 43.4329 35.7322 43.4013L35.74 43.4011L35.7479 43.401C36.6437 43.3976 37.5296 43.2132 38.3524 42.859C39.1751 42.5047 39.9178 41.9879 40.5359 41.3395L40.5432 41.3319L40.5432 41.332C41.7818 40.0861 42.477 38.4006 42.477 36.6438C42.477 34.8894 41.7838 33.2063 40.5485 31.9608L29.8293 21.8133L20.5816 31.6008ZM20.5816 31.6008L20.5779 31.5972M20.5816 31.6008L20.5779 31.5972M20.5779 31.5972C19.2804 30.3704 18.5235 28.6784 18.4736 26.8935C18.4237 25.1086 19.0848 23.377 20.3116 22.0795C21.5385 20.7821 23.2304 20.0252 25.0153 19.9753C26.8002 19.9253 28.5317 20.5864 29.8291 21.8131L20.5779 31.5972Z" fill="#F9C915" stroke="none"/>
                <path d="M102.894 41.3404L102.894 41.3405C104.041 42.5513 105.602 43.2866 107.265 43.4008C108.971 43.3895 110.608 42.7232 111.836 41.5392L102.894 41.3404ZM102.894 41.3404L102.885 41.3319C101.647 40.0859 100.952 38.4005 100.952 36.6437C100.952 34.8876 101.646 33.2029 102.884 31.9571L113.16 21.8238C114.472 20.7739 116.134 20.2597 117.811 20.3853C119.495 20.5115 121.069 21.2742 122.212 22.5186C123.355 23.763 123.981 25.3957 123.963 27.0852C123.946 28.7714 123.289 30.3879 122.125 31.6077L111.836 41.5389L102.894 41.3404Z" fill="#F9C915" stroke="none"/>
                <path d="M66.7978 116.848C68.045 115.601 69.7364 114.9 71.5001 114.9C73.2638 114.9 74.9552 115.601 76.2024 116.848C77.4495 118.095 78.1501 119.786 78.1501 121.55V135.85C78.1501 137.614 77.4495 139.305 76.2024 140.552C74.9552 141.799 73.2638 142.5 71.5001 142.5C69.7364 142.5 68.045 141.799 66.7978 140.552C65.5507 139.305 64.8501 137.614 64.8501 135.85V121.55C64.8501 119.786 65.5507 118.095 66.7978 116.848Z" fill="#F9C915" stroke="none"/>
                <path d="M102.882 111.041L102.882 111.041L102.878 111.037C101.608 109.812 100.877 108.131 100.846 106.367C100.815 104.602 101.486 102.897 102.712 101.627C103.938 100.357 105.618 99.6263 107.383 99.5951C109.147 99.5639 110.852 100.235 112.122 101.46C112.122 101.46 112.122 101.461 112.122 101.461L122.556 111.609C122.557 111.61 122.558 111.61 122.558 111.611C123.181 112.229 123.675 112.964 124.012 113.773C124.35 114.584 124.524 115.453 124.524 116.331C124.524 117.209 124.35 118.078 124.012 118.888C123.674 119.698 123.18 120.434 122.556 121.052L122.556 121.052L122.551 121.057C121.928 121.694 121.183 122.198 120.36 122.541C119.538 122.883 118.655 123.057 117.763 123.052L117.763 123.052C116.051 123.045 114.409 122.379 113.176 121.192L102.882 111.041Z" fill="#F9C915" stroke="none"/>
                <path d="M20.5838 111.397L30.0301 102.279V102.493L30.8774 101.675C32.1473 100.449 33.8521 99.7782 35.6169 99.8094C37.3817 99.8406 39.0618 100.572 40.2876 101.841C41.5134 103.111 42.1846 104.816 42.1534 106.581C42.1222 108.346 41.3913 110.026 40.1213 111.252L29.8336 121.182C28.6053 122.262 27.022 122.851 25.3864 122.837L25.3864 122.837L25.3792 122.837C24.4881 122.843 23.6052 122.669 22.7826 122.326C21.9601 121.983 21.2149 121.479 20.5912 120.842L20.5912 120.842L20.5862 120.837C19.9629 120.219 19.4682 119.484 19.1306 118.673C18.793 117.863 18.6191 116.994 18.6191 116.116C18.6191 115.238 18.793 114.369 19.1306 113.559C19.4678 112.749 19.9617 112.015 20.5838 111.397Z" fill="#F9C915" stroke="none"/>
                <path d="M55.8884 48.1357C60.5094 45.048 65.9423 43.4 71.4999 43.4C78.9525 43.4 86.0998 46.3605 91.3696 51.6303C96.6394 56.9 99.5999 64.0474 99.5999 71.5C99.5999 77.0576 97.9519 82.4905 94.8642 87.1115C91.7765 91.7325 87.3879 95.3342 82.2533 97.461C77.1187 99.5878 71.4687 100.144 66.0179 99.06C60.567 97.9758 55.5601 95.2995 51.6302 91.3697C47.7004 87.4398 45.0241 82.4329 43.9398 76.982C42.8556 71.5311 43.4121 65.8812 45.5389 60.7466C47.6657 55.612 51.2674 51.2233 55.8884 48.1357Z" fill="#F9C915" stroke="none"/>
            </svg>
        </div>
    
        <div
            class="cloud"
            v-if="weather == 'cloud'"
            style="text-align: center;"
        >
            <svg 
                width="163" 
                height="103" 
                viewBox="0 0 163 103" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                
            >
                <path d="M140.177 29.8042C136.839 12.7803 121.967 0 104.101 0C89.9159 0 77.5962 8.09253 71.4609 19.9353C56.687 21.5143 45.2017 34.0972 45.2017 49.3447C45.2017 65.6778 58.4049 78.9515 74.6512 78.9515H138.459C152.005 78.9515 163 67.8983 163 54.2792C163 41.2522 152.938 30.6924 140.177 29.8042Z" fill="#BAEAF8"/>
                <path d="M113.749 44.8141C109.752 24.6594 91.9398 9.52869 70.542 9.52869C53.5531 9.52869 38.7981 19.1095 31.45 33.1302C13.7557 34.9996 0 49.8966 0 67.9483C0 87.2852 15.8132 103 35.271 103H111.692C127.916 103 141.084 89.9141 141.084 73.7903C141.084 58.3675 129.033 45.8657 113.749 44.8141Z" fill="#BAEAF8"/>
                <path d="M77 9C87.4259 11.058 109.32 21.0391 113.491 44.5C124.264 45.0145 144.977 52.8348 141.641 80" stroke="#222222" stroke-width="2"/>
            </svg>
        </div>
    </div>
    <div 
            class="value"
    >
        <div
            class="wind-value"
        >
            <div class="wind">陣風</div>
            <div class="wind-num">{{windNum}}</div>
            <div class="wind-ms">m/s</div>
        </div>
        <div
            class="noise-value"
        >
            <div class="noise">噪音</div>
            <div class="noise-num">{{noiseNum}}</div>
            <div class="noise-db">dB</div>
        </div>
    </div>
</div>
`
export default {
    name: 'weather-card',
    template,
    data() {
        return {
            weather: 'cloud',
            newDate: new Date().toLocaleDateString(),
            location: '',
            temperature: 20,
            windNum: 12.2,
            noiseNum: 10.2,
        }
    },
    mounted() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.showPosition,
                this.showError
            );
            } else {
            this.location = '此瀏覽器不支援定位';
        }
    },
    methods: {
        showPosition(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // 經緯度轉換成地區
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`;

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                this.location = data.city;
                })
                .catch((error) => {
                console.error(error);
                this.location = "定位失敗";
                });
            },
            showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                this.location = "用戶拒絕了定位請求";
                break;

                case error.POSITION_UNAVAILABLE:
                this.location = "定位失敗";
                break;

                case error.TIMEOUT:
                this.location = " ";
                break;

                case error.UNKNOWN_ERROR:
                this.location = " ";
                break;

                default:
                this.location = " ";
                break;
            }
        },
    },
    computed: {
        getNewTime() {
            let date = new Date();
            let minutes = date.getMinutes();
            minutes = minutes > 9 ? minutes : '0' + minutes;
        
            return date.getHours() + ':' + minutes;
        },
    },
}