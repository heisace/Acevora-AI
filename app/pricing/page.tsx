'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SUBSCRIPTION_PLANS } from '@/lib/utils'
import { createCheckoutSession } from '@/app/actions/subscription'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async (plan: 'pro' | 'enterprise') => {
    setLoading(true)
    try {
      const { checkoutUrl } = await createCheckoutSession(plan)
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      alert('Failed to initiate checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 py-12">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            StudyGen AI
          </Link>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Choose the perfect plan for your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-lg p-8 border-2 transition-all ${
                key === 'pro'
                  ? 'border-blue-500 bg-white dark:bg-slate-800 shadow-xl md:scale-105'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
            >
              {key === 'pro' && (
                <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className="text-5xl font-bold text-slate-900 dark:text-white">Free</div>
                ) : (
                  <div>
                    <span className="text-5xl font-bold text-slate-900 dark:text-white">
                      ${(plan.price / 100).toFixed(2)}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">/month</span>
                  </div>
                )}
              </div>

              {key === 'free' ? (
                <Link href="/sign-up" className="w-full block">
                  <Button className="w-full mb-6" variant="outline">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => handleCheckout(key as 'pro' | 'enterprise')}
                  disabled={loading}
                  className="w-full mb-6"
                >
                  {loading ? 'Loading...' : 'Subscribe Now'}
                </Button>
              )}

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-1">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription anytime. No hidden fees or long-term contracts.',
              },
              {
                q: 'Do you offer discounts for teams?',
                a: 'Yes! Contact our support team for enterprise and team plans with custom pricing.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Start with our free plan to explore all features, then upgrade anytime to unlock premium capabilities.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
