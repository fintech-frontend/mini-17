"use client";

import ResourcePage from "@/components/admin/ResourcePage";

interface AdminFaq extends Record<string, unknown> {
  id: number;
  question: string;
  answer: string;
  sort: number;
}

export default function FaqAdminPage() {
  return (
    <ResourcePage<AdminFaq>
      title="FAQ"
      description="Вопросы и ответы для страницы «Вопрос-ответ»"
      resource="faq"
      noun="вопрос"
      itemName={(f) => f.question}
      searchPlaceholder="Вопрос"
      defaultSort={{ key: "sort", dir: "asc" }}
      defaults={{ question: "", answer: "", sort: "0" }}
      columns={[
        { key: "sort", header: "№", sortKey: "sort", align: "right", render: (f) => f.sort },
        {
          key: "question",
          header: "Вопрос",
          hideable: false,
          render: (f) => <span className="font-medium text-gray-900">{f.question}</span>,
        },
        { key: "answer", header: "Ответ", render: (f) => <span className="text-gray-500 line-clamp-2 max-w-xl">{f.answer}</span> },
      ]}
      fields={[
        { name: "question", label: "Вопрос", type: "text", required: true },
        { name: "answer", label: "Ответ", type: "textarea", required: true },
        { name: "sort", label: "Сортировка", type: "number", half: true },
      ]}
    />
  );
}
