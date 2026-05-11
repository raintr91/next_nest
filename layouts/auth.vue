<template>
  <div class="relative min-h-screen overflow-hidden bg-[#f5f0d7]">
    <div class="absolute inset-x-0 top-0 h-[42vh] bg-[#e4cd02]" />
    <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
