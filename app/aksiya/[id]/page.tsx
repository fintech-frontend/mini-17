'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { useState } from 'react'
import { styles } from '@/styles/index.styles'
import { promos as staticPromos } from '@/lib/heroDta'
import { useGetPromotionQuery, useGetPromotionsQuery } from '@/lib/api/promoApi'
import { formatDate, mapPromotion } from '@/lib/api/mappers'

const PROMO_CODE = 'LAKOART20'

// Route: /aksiya/[id]  ->  id bu API dagi aksiya slug'i (yoki statik aksiyaning id raqami)
// Next.js 15+ da `params` Promise bo'lib keladi, shuning uchun React.use() bilan ochamiz
function AksiyaDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [copied, setCopied] = useState(false)

  // GET /promotions/{slug}/ va GET /promotions/
  const { data: apiPromo, isLoading } = useGetPromotionQuery(id)
  const { data: apiPromos } = useGetPromotionsQuery()

  const promos = apiPromos?.length ? apiPromos.map(mapPromotion) : staticPromos
  const currentPromo = apiPromo
    ? mapPromotion(apiPromo)
    : staticPromos.find((p) => p.id === Number(id))

  if (isLoading) {
    return (
      <div className={`${styles.container} py-10`}>
        <div className="h-10 w-2/3 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-72 mt-5 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!currentPromo) {
    notFound()
  }

  const sideCards = promos.filter((p) => p.id !== currentPromo.id).slice(0, 3)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Nusxalashda xatolik:', err)
    }
  }

  return (
    <div className={`${styles.container} py-6 sm:py-8 md:py-10`}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
        {/* Chap tomon - asosiy kontent */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Акция на {currentPromo.title.toLowerCase()}. Скидки {currentPromo.discount}
          </h1>

          <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm">
            <span className="bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-md">
              АКЦИЯ
            </span>
            {currentPromo.validUntil && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">
                  Действует до {formatDate(currentPromo.validUntil)}
                </span>
              </>
            )}
          </div>

          {apiPromo ? (
            <div className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
              {apiPromo.body
                .split(/\n+/)
                .filter((line) => line.trim())
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
          ) : (
            <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              Уважаемые клиенты, рады объявить вам о нашей специальной акции на
              категорию «{currentPromo.title}»! Теперь вы можете придать своему
              дому новое великолепное обличие по невероятно выгодным ценам. Это
              ваш шанс создать уют и красоту в вашем жилище без лишних затрат!
            </p>
          )}

          {/* Katta rasm - bosilgan promoning o'zi */}
          <div className="relative w-full h-56 sm:h-72 md:h-96 mt-5 rounded-xl overflow-hidden">
            <Image
              src={currentPromo.image}
              alt={currentPromo.title}
              fill
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Statik aksiya uchun namuna matn va promokod (API aksiyasida body ichida bo'ladi) */}
          {!apiPromo && (
            <>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-7">
                Что мы предлагаем:
              </h2>

              <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                Широкий ассортимент качественной продукции категории «
                {currentPromo.title}» для любых задач. Разнообразие моделей и
                вариантов, чтобы удовлетворить самые изысканные вкусы. Продукция
                от проверенных производителей, гарантирующих долговечность и
                качество.
              </p>

              <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                Используйте промокод{' '}
                <span className="text-blue-600 font-semibold">{PROMO_CODE}</span>{' '}
                при оформлении заказа и получите дополнительную скидку{' '}
                {currentPromo.discount}. Это время для обновления вашего дома по
                самым доступным ценам!
              </p>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-6 mb-2">
                Промокод для скидки:
              </h3>


              <p
                role="button"
                tabIndex={0}
                onClick={handleCopy}
                onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
                className="w-fit flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer select-none hover:bg-blue-100 active:scale-95 transition"
              >
                {copied ? 'Скопировано!' : PROMO_CODE}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </>
                  )}
                </svg>
              </p>
            </>
          )}
        </div>

        {/* O'ng tomon - sidebar (qolgan aksiyalar) */}
        <aside className="flex flex-col gap-4">
          {sideCards.map((card) => (
            <Link
              key={card.id}
              href={`/aksiya/${card.slug ?? card.id}`}
              className="relative rounded-xl overflow-hidden h-32 sm:h-36 group"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="300px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="text-gray-900 font-semibold text-base leading-tight drop-shadow-sm">
                  {card.title}
                </span>
                <span className="w-fit bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {card.discount}
                </span>
              </div>
            </Link>
          ))}

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
              Подпишитесь на рассылку
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Регулярные скидки и спецпредложения, а так же новости компании.
            </p>

            <input
              type="email"
              placeholder="Email"
              className="w-full mt-3 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />

            <button
              type="button"
              className="w-full mt-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-md transition"
            >
              ПОДПИСАТЬСЯ
            </button>

            <label className="flex items-start gap-2 mt-3 text-[11px] text-gray-500 leading-tight">
              <input type="checkbox" className="mt-0.5" />
              Согласен с обработкой персональных данных в соответствии с
              политикой конфиденциальности
            </label>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AksiyaDetail
