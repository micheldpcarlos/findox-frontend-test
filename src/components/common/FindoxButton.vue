<script setup>
defineProps({
  type: String,
  iconName: String,
  iconLocation: String
})
</script>

<template>
  <button class="findox-button" :class="[type]" v-bind="$attrs">
    <font-awesome-icon
      v-if="iconName && iconLocation !== 'after'"
      :icon="`fa-solid ${iconName}`"
      class="button-icon before"
    />
    <slot />
    <font-awesome-icon
      v-if="iconName && iconLocation === 'after'"
      :icon="`fa-solid ${iconName}`"
      class="button-icon after"
    />
  </button>
</template>

<style lang="scss" scoped>
.findox-button {
  height: 32px;
  padding: 0.25rem 0.5rem;
  background-color: var(--button-bg);
  border: 1px solid var(--button-border-color);
  color: var(--button-color);
  transition-duration: var(--default-transition-duration);
  border-radius: 3px;
  line-height: 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px;
  }

  &.primary {
    background-color: var(--primary-color);
    border: 1px solid var(--primary-color);
    color: var(--white-color);

    &:hover {
      background-color: var(--primary-active-color);
    }
  }

  &.secondary {
    background-color: var(--secondary-color);
    border: 1px solid var(--secondary-color);
    color: var(--white-color);

    &:hover {
      background-color: var(--secondary-active-color);
    }
  }

  &.link {
    background-color: transparent;
    border: 0;
    color: var(--primary-color);

    &:hover {
      color: var(--primary-active-color);
      box-shadow: none;
    }
  }

  &[disabled] {
    background-color: #fafafb;
    color: #444445;
    border: 1px solid var(--button-border-color);
    pointer-events: none;
    opacity: 0.8;
  }

  .button-icon {
    &.before {
      margin-right: 0.25rem;
    }
    &.after {
      margin-left: 0.25rem;
    }
  }
}
</style>
