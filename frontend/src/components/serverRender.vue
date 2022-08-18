<template>
    <div class="server" :style="{'margin-left': inLeftMargin}">
        <div class="server-icon">
            🖲️
        </div>
        <div class="server-text">
            {{ text.status }}
        </div>
    </div>
</template>

<script>
export default {
    name: "serverRender",
    props: {
        text: Object,
        inLeftMargin: String,
    },
}
</script>

<style>
.server {
    position: absolute;
    transition: margin-left 0.5s;
}

.server-icon {
    font-size: 4em;
}

</style>