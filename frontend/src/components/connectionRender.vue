<template>
    <div class="connection" :class="{ disappearing: removing}">
        <svg width="100%" height="500">
            <path :d="pathString"/>
        </svg>
    </div>
</template>

<script>
export default {
    name: "connectionRender",
    props: {
        text: Object,
        sourceX: String,
        sourceY: String,
        midX: String,
        midY: String,
        destX: String,
        destY: String,
        removing: Boolean,
    },
    computed: {
        pathString: function () {
            return 'M' + Math.floor(this.destX) + ' ' + Math.floor(this.destY) + ' Q' + Math.floor(this.midX) + ' ' + Math.floor(this.midY) + ' ' + Math.floor(this.sourceX) + ' ' + Math.floor(this.sourceY);
        }
    }
}
</script>

<style>
.connection {
    position: absolute;
    width: 100%;
    transition: opacity 0.5s;
}

path {
    fill: none;
    stroke: rgb(179, 69, 69);
    stroke-width: 2px;
    stroke-dashoffset: 870;
    stroke-dasharray: 870;
    animation: draw 1s ease-in-out;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.disappearing {
    opacity: 0.0;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>