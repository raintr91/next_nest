<script setup lang="ts">
import { useField } from 'vee-validate'
import { useAuthResetPasswordForm } from '~/composables/auth/useAuthResetPasswordForm'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const route = useRoute()
const tokenParam = computed(() => String(route.params.token ?? ''))
const emailQuery = computed(() => String(route.query.email ?? ''))

const { apiError, isSubmitting, onSubmit, errors } = useAuthResetPasswordForm({
  email: emailQuery.value,
  token: tokenParam.value
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: password_confirmation } = useField<string>('password_confirmation')
const { value: token } = useField<string>('token')

watch(tokenParam, (value) => {
  token.value = value
})

watch(emailQuery, (value) => {
  email.value = value
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto max-w-[520px] px-4 pt-20">
      <div class="mb-6 text-center">
        <p class="mb-5 text-[22px] font-bold leading-none">{{ $t('auth.resetTitle') }}</p>
        <p class="text-[14px] font-medium leading-6 text-[#818181]">
          {{ $t('auth.resetSubtitle') }}
        </p>
      </div>

      <form @submit.prevent="onSubmit">
        <input v-model="token" type="hidden" name="token" />

        <div class="mb-3">
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
                placeholder="メールアドレスを入力"
                required
                class="h-full w-full border-0 bg-transparent px-3 text-[16px] outline-none"
                :class="errors.email ? 'bg-[#FDDDDD]' : ''"
              />
            </div>
          </div>
          <p v-if="errors.email" class="mt-1 text-[12px] text-red-600">{{ errors.email }}</p>
        </div>

        <div class="mb-3">
          <div class="rounded border" :class="errors.password ? 'border-[#F55753] bg-[#FDDDDD]' : 'border-[#EEEEEE]'">
            <div class="flex h-[50px] items-center">
              <div
                class="flex h-full items-center justify-center border-r border-[#EEEEEE] px-4 text-[25px]"
                :class="errors.password ? 'bg-[#FDDDDD]' : 'bg-white'"
              >
                🔒
              </div>
              <input
                v-model="password"
                type="password"
                name="password"
                autocomplete="new-password"
                placeholder="新しいパスワードを入力"
                required
                class="h-full w-full border-0 bg-transparent px-3 text-[16px] outline-none"
                :class="errors.password ? 'bg-[#FDDDDD]' : ''"
              />
            </div>
          </div>
          <p v-if="errors.password" class="mt-1 text-[12px] text-red-600">{{ errors.password }}</p>
        </div>

        <div class="mb-3">
          <div
            class="rounded border"
            :class="errors.password_confirmation ? 'border-[#F55753] bg-[#FDDDDD]' : 'border-[#EEEEEE]'"
          >
            <div class="flex h-[50px] items-center">
              <div
                class="flex h-full items-center justify-center border-r border-[#EEEEEE] px-4 text-[25px]"
                :class="errors.password_confirmation ? 'bg-[#FDDDDD]' : 'bg-white'"
              >
                🔒
              </div>
              <input
                v-model="password_confirmation"
                type="password"
                name="password_confirmation"
                autocomplete="new-password"
                placeholder="新しいパスワード（確認用）を再入力"
                required
                class="h-full w-full border-0 bg-transparent px-3 text-[16px] outline-none"
                :class="errors.password_confirmation ? 'bg-[#FDDDDD]' : ''"
              />
            </div>
          </div>
          <p v-if="errors.password_confirmation" class="mt-1 text-[12px] text-red-600">
            {{ errors.password_confirmation }}
          </p>
        </div>

        <p v-if="apiError" class="mb-2 text-[12px] text-red-600">{{ apiError }}</p>

        <div class="mt-6 text-center">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="rounded bg-[#4EAAFF] px-5 py-[7px] text-[18px] text-white disabled:opacity-60"
          >
            {{ isSubmitting ? '更新中...' : $t('auth.update') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
