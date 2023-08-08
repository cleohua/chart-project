//空氣
var template = /*html*/ `
<div
    id="circle-card"
    class="card"
>
    <div class="title-text">現在空氣</div>
    <div class="second-text">空氣品質指標</div>
    <div class="circle">
        <div class="circle-text">
            <div class="aqi-text">AQI</div>
            <div class="aqi">{{aqi}}</div>
            <div class="aqi-text">{{showAqi}}</div>
        </div>
    </div>
    <div class="pm">
        <div class="pm-main">
            <div class="pm-text">PM2.5</div>
            <div class="pm-number">{{pmNumber}}</div>
            <div class="pm-color"></div>
        </div>
        <div class="pm-main">
            <div class="pm-text">PM10</div>
            <div class="pm-number">{{particle}}</div>
            <div class="particle-color"></div>
        </div>
    </div>
</div>
`
export default {
    name: 'circle-card',
    template,
    data() {
        return {
            aqi: 42,
            pmNumber: 1.5,
            particle: 101,
        }
    },
    computed: {
        showAqi() {
            if(this.aqi < 50) {
                return '良好'
            }else {
                return '危險'
            };
        }
  
    },
}
