"use client";

import ResourcePage from "@/components/admin/ResourcePage";

type Row = { id: number; question: string; answer: string; sort: number } & Record<string, unknown>;

export default function FaqPage() {
  return (
    <ResourcePage<Row>
      resource="faq"
      title="Вопрос-ответ"
      subtitle="Показывается на странице «Вопрос-ответ»"
      createLabel="Добавить вопрос"
      defaultOrdering="sort"
      columns={[
        { key: "sort", label: "№", sortable: true, align: "right" },
        { key: "question", label: "Вопрос", render: (r) => <span className="font-medium text-gray-900">{r.question}</span> },
        { key: "answer", label: "Ответ", render: (r) => <span className="line-clamp-2 max-w-lg text-gray-500">{r.answer}</span> },
      ]}
      fields={[
        { name: "question", label: "Вопрос", type: "text", required: true, wide: true },
        { name: "answer", label: "Ответ", type: "textarea", required: true },
        { name: "sort", label: "Порядок", type: "number" },
      ]}
    />
  );
}
