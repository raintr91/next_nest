<script setup lang="ts">
import { useField } from 'vee-validate'
import { useAuthRegisterForm } from '~/composables/auth/useAuthRegisterForm'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { apiError, isSubmitting, onSubmit, errors } = useAuthRegisterForm()
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: password_confirmation } = useField<string>('password_confirmation')
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto max-w-[520px] px-4 pt-16">
      <div class="mb-6 text-center">
        <p class="mb-2 text-[22px] font-bold">{{ $t('auth.registerTitle') }}</p>
        <p class="text-[14px] text-[#818181]">{{ $t('auth.registerSubtitle') }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <input
            v-model="name"
            type="text"
            name="name"
            autocomplete="name"
            :placeholder="$t('auth.optionalName')"
            class="w-full border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <input
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            required
            :placeholder="$t('auth.email')"
            class="w-full border px-3 py-2"
            :class="errors.email ? 'border-red-400 bg-[#FDDDDD]' : 'border-gray-300'"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <input
            v-model="password"
            type="password"
            name="password"
            autocomplete="new-password"
            required
            :placeholder="$t('auth.password')"
            class="w-full border px-3 py-2"
            :class="errors.password ? 'border-red-400 bg-[#FDDDDD]' : 'border-gray-300'"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <div>
          <input
            v-model="password_confirmation"
            type="password"
            name="password_confirmation"
            autocomplete="new-password"
            required
            :placeholder="$t('auth.confirmPassword')"
            class="w-full border px-3 py-2"
            :class="errors.password_confirmation ? 'border-red-400 bg-[#FDDDDD]' : 'border-gray-300'"
          />
          <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">
            {{ errors.password_confirmation }}
          </p>
        </div>

        <p v-if="apiError" class="text-sm text-red-600">{{ apiError }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded bg-[#4EAAFF] py-2 text-white disabled:opacity-60"
        >
          {{ isSubmitting ? '...' : $t('auth.register') }}
        </button>
      </form>

      <div class="mt-5 text-center">
        <NuxtLink to="/auth/login" class="text-[#4EAAFF] underline">{{ $t('auth.backToLogin') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
