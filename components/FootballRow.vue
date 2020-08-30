<template>
  <td :class="[ compareTo == 0 ? 'equal' : (compareTo < 0 ? 'less' : 'more')]">
    <span>
      {{ display }}</span>
    </span>
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
