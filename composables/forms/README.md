# useApiForm

A small base composable that combines:

- `vee-validate` (`useForm`, `errors`, `isSubmitting`)
- backend 422 validation errors (Laravel-style `{ errors: { field: [message] } }`)

So new forms can reuse one pattern: **schema + initialValues + submit()**.

## Example

```ts
import { useApiForm } from '~/composables/forms/useApiForm'
import { useField } from 'vee-validate'
import { loginSchema } from '~/validations/auth/schemas'
import type { LoginRequest } from '~/types/api/auth'

const { onSubmit, errors, apiError, isSubmitting } = useApiForm<LoginRequest>({
  validationSchema: loginSchema,
  initialValues: { email: '', password: '' },
  submit: async (values) => {
    await submitLogin(values) // your API call composable
  }
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
```

Template:

```vue
<form @submit.prevent="onSubmit">
  <UiInput v-model="email" />
  <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>

  <UiInput v-model="password" />
  <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>

  <p v-if="apiError" class="text-sm text-destructive">{{ apiError }}</p>
</form>
```
