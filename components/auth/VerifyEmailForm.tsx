"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useLoginMutation,
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/lib/api/authApi";
import { parseAuthError, type FieldErrors } from "./authErrors";
import { CodeInput, FormError, FormNotice, PrimaryButton } from "./ui";

// POST /auth/verify/ — emailga kelgan 6 xonali kod bilan akkauntni faollashtirish.
// Parol ma'lum bo'lsa, tasdiqlangach avtomatik tizimga kiramiz.
export default function VerifyEmailForm({
  email,
  password,
  remember = true,
  initialNotice,
  onVerified,
}: {
  email: string;
  password?: string;
  remember?: boolean;
  initialNotice: string;
  onVerified: (loggedIn: boolean) => void;
}) {
  const [code, setCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [notice, setNotice] = useState(initialNotice);

  const [verifyEmail, { isLoading: verifying }] = useVerifyEmailMutation();
  const [resend, { isLoading: resending }] = useResendVerificationMutation();
  const [login, { isLoading: loggingIn }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    try {
      await verifyEmail({ email, code }).unwrap();
    } catch (error) {
      const { fields, general } = parseAuthError(error);
      setFieldErrors(fields);
      setGeneralError(general || fields.email || "");
      return;
    }

    if (password) {
      try {
        const res = await login({ email, password, remember }).unwrap();
        toast.success(`Добро пожаловать${res.user?.first_name ? `, ${res.user.first_name}` : ""}!`);
        onVerified(true);
        return;
      } catch {
        // Avto-kirish bo'lmasa — foydalanuvchi o'zi kiradi
      }
    }
    toast.success("Email подтверждён. Теперь войдите в аккаунт.");
    onVerified(false);
  };

  // POST /auth/resend-verification/
  const handleResend = async () => {
    setGeneralError("");
    try {
      await resend({ email }).unwrap();
      setNotice(`Новый код отправлен на ${email}.`);
    } catch (error) {
      setGeneralError(parseAuthError(error).general);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormNotice message={notice} />
      <CodeInput value={code} onChange={setCode} error={fieldErrors.code} />
      <FormError message={generalError} />
      <PrimaryButton loading={verifying || loggingIn}>Подтвердить email</PrimaryButton>
      <p className="text-center text-[13px] text-gray-500">
        Не пришло письмо?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-[#1f6fd8] hover:underline disabled:opacity-50"
        >
          {resending ? "Отправляем..." : "Отправить код ещё раз"}
        </button>
      </p>
    </form>
  );
}
