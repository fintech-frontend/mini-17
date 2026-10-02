'use client'

import { promos as staticPromos } from '@/lib/heroDta'
import { useGetPromotionsQuery } from '@/lib/api/promoApi'
import { mapPromotion } from '@/lib/api/mappers'
import Image from 'next/image'
import Link from 'next/link'
import { styles } from '@/styles/index.styles'

function Aksiya() {
    // GET /promotions/ — bo'sh bo'lsa statik aksiyalar ko'rsatiladi
    const { data } = useGetPromotionsQuery()
    const promos = data?.length ? data.map(mapPromotion) : staticPromos

    return (
        <div className={styles.container}>
            <h2 className='text-2xl sm:text-4xl text-gray-500 lg:text-5xl font-bold mt-4 mb-4'>
                АКЦИИ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 pb-6 sm:pb-8 md:pb-10">
                {promos.map((promo) => (
                    <div key={promo.id} className="flex flex-col">
                        <Link 
                            href={`/aksiya/${promo.slug ?? promo.id}`}
                            className="relative rounded-xl overflow-hidden h-28 sm:h-32 md:h-36 group block"
                        >
                            <Image
                                src={promo.image}
                                alt={promo.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
                            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between">
                                <h3 className="text-black font-semibold text-sm sm:text-base md:text-lg leading-tight drop-shadow-sm">
                                    {promo.title}
                                </h3>
                                <span className="w-fit bg-gray-900 text-white text-[10px] sm:text-[11px] md:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-md">
                                    {promo.discount}
                                </span>
                            </div>
                        </Link>
                        
                        <div className="mt-2">
                            <h3 className="text-[20px] font-medium text-gray-900">
                                Делаем скидки на все метизные изделия до {promo.discount}
                            </h3>
                            <Link href={`/aksiya/${promo.slug ?? promo.id}`}>
                                <p className="text-[16px] text-blue-500 mt-1 cursor-pointer hover:underline hover:text-red-600 inline-block">
                                    Подробнее об акции
                                </p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Aksiya