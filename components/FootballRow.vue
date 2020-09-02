<template>
  <td :class="[ compareTo == 0 ? 'equal' : (compareTo < 0 ? 'less' : 'more')]">
    {{ display.toFixed(2) }}
  </td>
</template>

<script>
export default {
  props: ['display', 'compareTo']
}
</script>

<style>

.equal {
  background: white
}

.less {
  background: red
}

.more {
  background: green
}

</style>
