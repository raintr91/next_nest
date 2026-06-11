<script setup lang="ts">
import { useField } from 'vee-validate'
import { useAuthForgotPasswordForm } from '~/composables/auth/useAuthForgotPasswordForm'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { apiError, successMessage, isSubmitting, onSubmit, errors } = useAuthForgotPasswordForm()
const { value: email } = useField<string>('email')
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto max-w-[520px] px-4 pt-20">
      <div
        v-if="successMessage"
        class="mb-5 rounded bg-white px-4 py-2 text-center font-bold text-[#4EAAFF] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
      >
        {{ successMessage }}
      </div>

      <div class="mb-6 text-center">
        <p class="mb-5 text-[22px] font-bold leading-none">{{ $t('auth.forgotTitle') }}</p>
        <p class="text-[14px] font-medium leading-6 text-[#818181]">
          パスワードをリセットします。<br />
          登録しているメールアドレスを入力してください。<br />
          入力されたメールアドレスに再設定用のURLを送信します。
        </p>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="rounded border" :class="errors.email ? 'border-[#F55753] bg-[#FDDDDD]' : 'border-[#EEEEEE]'">
          <div class="flex h-[50px] items-center">
            <div
              class="flex h-full items-center justify-center border-r border-[#EEEEEE] px-4 text-[25px]"
              :class="errors.email ? 'bg-[#FDDDDD]' : 'bg-white'"
            >
              @
            </div>
            <input
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              autofocus
              required
              placeholder="メールアドレスを入力"
              class="h-full w-full border-0 bg-transparent px-3 text-[16px] outline-none"
              :class="errors.email ? 'bg-[#FDDDDD]' : ''"
            />
          </div>
        </div>

        <p v-if="apiError" class="mt-2 text-sm text-red-600">{{ apiError }}</p>
        <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>

        <div class="mt-6 text-center">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="rounded bg-[#4EAAFF] px-5 py-[7px] text-[18px] text-white disabled:opacity-60"
          >
            {{ isSubmitting ? '送信中...' : 'パスワード再設定用メールを送信' }}
          </button>
        </div>
      </form>

      <div class="mt-5 text-center">
        <NuxtLink to="/auth/login" class="text-[16px] text-[#4EAAFF] underline">
          {{ $t('auth.backToLogin') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
