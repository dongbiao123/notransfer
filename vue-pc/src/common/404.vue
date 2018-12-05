<template>
    <div i="not_found_wrap">
        <h1 class="text-center">404</h1>
        <h2>
            抱歉，页面被外星人劫走了~~
        </h2>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    [i="not_found_wrap"]{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        z-index: 9999999;

        h1{
            text-align: center;
            color: #fff;
            font-size: 150px;
            line-height: 1;
            margin: 100px 0 20px;
            font-weight: 300;
            text-stroke: 1px transparent;
            -webkit-text-stroke: 1px transparent;
            display: block;
            text-shadow: 0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0,0,0,.1),
            0 0 5px rgba(0,0,0,.1),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.15);
        }

        h2{
            font-size: 22px;
            font-weight: 300;
            color: #9aabb1;
            margin: 0;
            text-align: center;
        }
    }

</style>
<script>

</script>
