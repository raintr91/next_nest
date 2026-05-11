<template>
  <NuxtRouteAnnouncer />
  <OrGlobalToast />
  <OrGlobalDialog />
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b bg-card">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div class="text-sm font-semibold">{{ $t('app.title') }}</div>
        <NuxtLink class="text-sm text-muted-foreground hover:text-foreground" to="/auth/login">{{ $t('auth.signIn') }}</NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-8">
      <NuxtPage />
    </main>
  </div>
</template>
