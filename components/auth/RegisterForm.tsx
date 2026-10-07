"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/lib/api/authApi";
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

// "+7 (___) ___-__-__" ko'rinishida formatlash
function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "";
  let out = `+7 (${digits.slice(0, 3)}`;
  if (digits.length >= 3) out += ") ";
  if (digits.length > 3) out += digits.slice(3, 6);
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;
  return out;
}

// ФИО -> backend'ning first_name / last_name maydonlari ("Иванов Иван Иванович")
function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { first_name: parts[0] ?? "", last_name: "" };
  return { last_name: parts[0], first_name: parts.slice(1).join(" ") };
}

// /registraciya — "Регистрация" va undan keyin emailni kod bilan tasdiqlash
export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [registered, setRegistered] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    // Backend'ga yuborishdan oldingi oddiy tekshiruvlar
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = "Заполните это поле.";
    if (phone.replace(/\D/g, "").length !== 11) errors.phone_number = "Введите номер телефона полностью.";
    if (!fullName.trim()) errors.first_name = "Заполните это поле.";
    if (!password) errors.password = "Заполните это поле.";
    if (password && password2 !== password) errors.password2 = "Пароли не совпадают.";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    if (!acceptTerms || !acceptPrivacy) {
      setGeneralError("Подтвердите согласие с условиями обслуживания и обработкой персональных данных.");
      return;
    }

    try {
      // POST /auth/register/ — emailga 6 xonali kod yuboriladi
      await register({
        email: email.trim(),
        password,
        password2,
        ...splitFullName(fullName),
        phone_number: `+${phone.replace(/\D/g, "")}`,
      }).unwrap();
      setRegistered(true);
    } catch (error) {
      const { fields, general } = parseAuthError(error);
      // Ism/familiya xatolarini ФИО maydoni ostida ko'rsatamiz
      if (fields.last_name && !fields.first_name) fields.first_name = fields.last_name;
      setFieldErrors(fields);
      setGeneralError(general);
    }
  };

  const form = registered ? (
    <VerifyEmailForm
      email={email.trim()}
      password={password}
      initialNotice={`Мы отправили 6-значный код на ${email.trim()}. Введите его, чтобы подтвердить email и завершить регистрацию.`}
      onVerified={() => router.push("/kantak")}
    />
  ) : (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Email" required error={fieldErrors.email}>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email адрес"
            className={inputClass(!!fieldErrors.email)}
          />
        </Field>
        <Field label="Номер телефона" required error={fieldErrors.phone_number}>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="+7 (___) ___-__-__"
            className={inputClass(!!fieldErrors.phone_number)}
          />
        </Field>
      </div>
      <Field label="ФИО" required error={fieldErrors.first_name}>
        <input
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ваше полное имя"
          className={inputClass(!!fieldErrors.first_name)}
        />
      </Field>
      <Field label="Пароль" required error={fieldErrors.password}>
        <PasswordInput
          value={password}
          onChange={setPassword}
          error={!!fieldErrors.password}
          autoComplete="new-password"
        />
      </Field>
      <Field label="Подтвердите пароль" required error={fieldErrors.password2}>
        <PasswordInput
          value={password2}
          onChange={setPassword2}
          error={!!fieldErrors.password2}
          autoComplete="new-password"
        />
      </Field>

      <div className="space-y-3 pt-1">
        <Checkbox checked={acceptTerms} onChange={setAcceptTerms}>
          Согласен с условиями обслуживания
        </Checkbox>
        <Checkbox checked={acceptPrivacy} onChange={setAcceptPrivacy}>
          Согласен с обработкой персональных данных в соответствии с{" "}
          <Link href="/privecyPolicyPage" className="text-[#1f6fd8] underline hover:no-underline">
            политикой конфиденциальности
          </Link>
        </Checkbox>
      </div>

      <FormError message={generalError} />
      <PrimaryButton loading={isLoading}>Зарегистрироваться</PrimaryButton>
    </form>
  );

  return (
    <AuthPage crumb="Регистрация" title={registered ? "Подтверждение email" : "Регистрация"}>
      <AuthCard
        form={form}
        aside={
          <AuthAside title="Уже есть аккаунт?" href="/kantak" button="Авторизоваться">
            <p>
              Перейдите к <strong className="font-semibold text-gray-900">авторизации</strong> если у
              вас уже есть зарегистрированный аккаунт.
            </p>
          </AuthAside>
        }
      />
    </AuthPage>
  );
}
