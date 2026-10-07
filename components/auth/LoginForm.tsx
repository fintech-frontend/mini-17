"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/lib/api/authApi";
import { parseAuthError, type FieldErrors } from "./authErrors";
import VerifyEmailForm from "./VerifyEmailForm";
import {
  AuthAside,
  AuthCard,
  AuthPage,
  Checkbox,
  Field,
  FormError,
  PasswordInput,
  PrimaryButton,
  inputClass,
} from "./ui";

// /kantak — "Авторизация" (stroiopttorg.ru/my-account uslubida)
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  // 403 — akkaunt bor, lekin email tasdiqlanmagan
  const [needsVerify, setNeedsVerify] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  // POST /auth/login/ — muvaffaqiyatli bo'lsa /kantak shaxsiy kabinetni ko'rsatadi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    if (!email.trim() || !password) {
      setFieldErrors({
        ...(email.trim() ? {} : { email: "Заполните это поле." }),
        ...(password ? {} : { password: "Заполните это поле." }),
      });
      return;
    }
    try {
      const res = await login({ email: email.trim(), password, remember }).unwrap();
      toast.success(`Добро пожаловать${res.user?.first_name ? `, ${res.user.first_name}` : ""}!`);
    } catch (error) {
      if ((error as { status?: number }).status === 403) {
        setNeedsVerify(true);
        return;
      }
      const { fields, general } = parseAuthError(error);
      setFieldErrors(fields);
      setGeneralError(general);
    }
  };

  const form = needsVerify ? (
    <VerifyEmailForm
      email={email.trim()}
      password={password}
      remember={remember}
      initialNotice={`Email ${email.trim()} ещё не подтверждён. Введите код из письма или запросите новый.`}
      onVerified={(loggedIn) => !loggedIn && setNeedsVerify(false)}
    />
  ) : (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Email" required error={fieldErrors.email}>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите данные для авторизации"
          className={inputClass(!!fieldErrors.email)}
        />
      </Field>
      <Field label="Пароль" required error={fieldErrors.password}>
        <PasswordInput
          value={password}
          onChange={setPassword}
          error={!!fieldErrors.password}
          autoComplete="current-password"
        />
      </Field>

      <Link
        href="/kantak/vosstanovlenie"
        className="flex items-center justify-center h-13 bg-gray-50 hover:bg-gray-100 text-[#1f6fd8] text-[13px] font-medium rounded-md transition-colors"
      >
        Восстановить пароль
      </Link>

      <FormError message={generalError} />
      <PrimaryButton loading={isLoading}>Авторизоваться</PrimaryButton>

      <div className="flex justify-center">
        <Checkbox checked={remember} onChange={setRemember}>
          Запомнить меня
        </Checkbox>
      </div>
    </form>
  );

  return (
    <AuthPage crumb="Авторизация" title={needsVerify ? "Подтверждение email" : "Авторизация"}>
      <AuthCard
        form={form}
        aside={
          <AuthAside title="Еще нет аккаунта?" href="/registraciya" button="Зарегистрироваться">
            <p>
              <strong className="font-semibold text-gray-900">Регистрация на сайте</strong> позволяет
              получить доступ к статусу и истории вашего заказа. Просто заполните поля ниже, и вы
              получите учетную запись.
            </p>
            <p>
              Мы запрашиваем у вас только информацию, необходимую для того, чтобы сделать процесс
              покупки более быстрым и легким.
            </p>
          </AuthAside>
        }
      />
    </AuthPage>
  );
}
