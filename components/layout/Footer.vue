<script setup lang="ts">

</script>

<template>
  <footer class="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-8 text-slate-200 shadow-xl shadow-indigo-500/20 backdrop-blur-2xl">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div class="absolute right-[-80px] top-0 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl"></div>
      <div class="absolute bottom-[-120px] left-1/3 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
    </div>

    <div class="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <NuxtLink
            to="/"
            class="inline-block bg-gradient-to-r from-indigo-300 via-sky-200 to-purple-300 bg-clip-text text-2xl font-semibold text-transparent"
        >LibraryApp</NuxtLink>
        <p class="max-w-md text-sm text-slate-300/80">
          Цифровое пространство для поиска вдохновляющих историй и управления библиотекой нового поколения.
        </p>
      </div>
      <div class="grid gap-4 text-sm sm:grid-cols-2 sm:gap-6">
        <div class="space-y-2">
          <h3 class="text-xs uppercase tracking-[0.3em] text-indigo-200/80">Контакты</h3>
          <ul class="space-y-1.5 text-slate-200/90">
            <li class="flex items-center gap-2">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-100">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.005 1.875l-7.5 5a2.25 2.25 0 01-2.49 0l-7.5-5a2.25 2.25 0 01-1.005-1.875V6.75" />
                </svg>
              </span>
              <a href="mailto:библиотека@example.com" class="transition hover:text-indigo-200">библиотека@example.com</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-100">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75l7.5 4.5 7.5-4.5m-15 0A2.25 2.25 0 013.75 4.5h16.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H3.75a2.25 2.25 0 01-2.25-2.25z" />
                </svg>
              </span>
              <a href="tel:+71234567890" class="transition hover:text-indigo-200">Телефон: +7 (123) 456-78-90</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-100">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m5.25 0a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
                </svg>
              </span>
              <span>Пн-Пт: 9:00 – 18:00</span>
            </li>
          </ul>
        </div>
        <div class="space-y-2">
          <h3 class="text-xs uppercase tracking-[0.3em] text-indigo-200/80">Мы рядом</h3>
          <ul class="space-y-1.5 text-slate-200/90">
            <li class="flex items-center gap-2">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/30 text-sky-100">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 3.75l-7.5 7.5 7.5 7.5m1.5-15l7.5 7.5-7.5 7.5" />
                </svg>
              </span>
              <NuxtLink to="/catalog" class="transition hover:text-indigo-200">Каталог книг</NuxtLink>
            </li>
            <li class="flex items-center gap-2">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/30 text-sky-100">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75h3a2.25 2.25 0 012.25 2.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V9a2.25 2.25 0 012.25-2.25h3m7.5 0V5.25a3.75 3.75 0 00-7.5 0V6.75m7.5 0h-7.5" />
                </svg>
              </span>
              <NuxtLink to="/auth/login" class="transition hover:text-indigo-200">Вход и регистрация</NuxtLink>
            </li>
            <li class="flex items-center gap-2">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/30 text-sky-100">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-9 5.25h9" />
                </svg>
              </span>
              <NuxtLink to="/recomendation" class="transition hover:text-indigo-200">ИИ рекомендации</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p class="mt-6 text-center text-xs text-slate-400/80">
      Сделал студент ТУИТ, группы 321-21 Палазник Максим
    </p>
  </footer>
</template>
