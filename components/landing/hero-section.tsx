'use client'

import { useState } from 'react'
import { LoginForm } from './login-form'
import { CarouselShowcase } from './carousel-showcase'

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Login Form */}
          <div className="order-2 lg:order-1">
            <LoginForm />
          </div>

          {/* Right side - Carousel Showcase */}
          <div className="order-1 lg:order-2">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                写不出来？
                <br />
                <span className="text-orange-600">靠山盟</span> 懂你。
              </h1>
              <p className="text-lg text-gray-600">
                靠山盟不只是工具，更是创作搭子。
              </p>
            </div>
            <CarouselShowcase />
          </div>
        </div>
      </div>
    </section>
  )
}
