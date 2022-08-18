<template>
    <div class="client" :class="{ disappearing: disappearingCheck(), success: (statusText == 'done'), failure: (statusText == 'left' || statusText == 'failed') }"
        :style="{ 'margin-left': inLeftMargin, 'margin-top': inTopMargin }">
        <div class="client-icon">
            💻
        </div>
    </div>
</template>

<script>
export default {
    name: "clientRender",
    props: {
        text: Object,
        inLeftMargin: String,
        inTopMargin: String,
        removing: Boolean,
        statusText: String,
    },
    data: function () {
        return {
            disappearing: true,
        }
    },
    methods: {
        setDisappearingFalse() {
            this.disappearing = false;
        },
        disappearingCheck: function () {
            // return this.disappearing;
            return (this.removing || this.disappearing);
        }
    },
    mounted: function () {
        setTimeout(
            this.setDisappearingFalse.bind(this),
            10,
        )
    }
}
</script>

<style>
.client {
    position: absolute;
    transition: opacity 0.5s;
}

.client-icon {
    font-size: 4em;
}

.disappearing {
    opacity: 0.0;
}

.success {
    color: blue;   
    color: transparent; 
    text-shadow: 0 0 0 blue;
}

.failure {
     color: yellow;   
    color: transparent; 
    text-shadow: 0 0 0 yellow;
}
</style>