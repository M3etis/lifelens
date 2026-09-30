(function () {
  "use strict";

  // Прожиточный минимум (ПМ) на душу населения, ₸.
  // Обновляется ежегодно законом о республиканском бюджете.
  // Значение ориентировочное на 2026 г. — при необходимости поправьте.
  const PM_VALUE = 46000;

  function fmtT(n) {
    return n.toLocaleString("ru-RU").replace(/\u00A0/g, " ") + " ₸";
  }

  function pmRange(fromMul, toMul) {
    const a = Math.round(PM_VALUE * fromMul);
    const b = Math.round(PM_VALUE * toMul) - 1;
    return fmtT(a) + " – " + fmtT(b);
  }

  function pmMin(mul) {
    return "от " + fmtT(Math.round(PM_VALUE * mul));
  }

  // ===== i18n =====
  const i18n = {
    ru: {
      appTitle: "Уровень социального благополучия семьи",
      appSubtitle: "Калькулятор по методике приказа № 267 от 29.06.2023",
      introText:
        "Ответьте на вопросы по 8 направлениям. Итоговый балл Усб — это сумма баллов по каждому направлению. Чем выше балл, тем выше уровень социального благополучия семьи (лица).",
      calculateBtn: "Рассчитать",
      resetBtn: "Сбросить",
      recalcBtn: "Пересчитать",
      exportBtn: "Скачать PNG",
      resultCategoryLabel: "Категория",
      resultScoreLabel: "Итоговый балл",
      breakdownTitle: "Баллы по направлениям",
      footerNote:
        "Расчёт производится по данным, указанным пользователем. Методика: приказ Министра труда и социальной защиты населения РК № 267 от 29.06.2023 (с изменениями № 247 от 17.06.2026). ПМ на 2026 г.: " +
        fmtT(PM_VALUE) +
        ".",
      scoreWord: "балл",
      categories: {
        A: "Благополучный",
        B: "Удовлетворительный",
        C: "Неудовлетворительный",
        D: "Кризисный",
        E: "Экстренный",
      },
      categoryDesc: {
        A: "Семья (лицо) с высоким уровнем социального благополучия. Как правило, не нуждаются в мерах социальной поддержки.",
        B: "Семья (лицо) с достаточным уровнем благополучия. Как правило, не нуждаются в постоянных мерах социальной поддержки.",
        C: "Семья (лицо), имеющие признаки нуждаемости. Могут быть потенциальными получателями мер социальной поддержки.",
        D: "Семья (лицо), испытывающие значительные трудности. Рассматриваются как потенциально нуждающиеся в мерах социальной защиты.",
        E: "Семья (лицо) с критическим уровнем социального благополучия. Являются приоритетными получателями мер социальной поддержки.",
      },
      pointsFormat: (n) => (n > 0 ? "+" + n : String(n)),
    },
    kz: {
      appTitle: "Отбасының әлеуметтік әл-ауқаты деңгейі",
      appSubtitle: "2023 ж. 29 маусымдағы № 267 бұйрық әдістемесі бойынша калькулятор",
      introText:
        "8 бағыт бойынша сұрақтарға жауап беріңіз. Жалпы Ұсб балл — әр бағыт бойынша баллдардың қосындысы. Балл неғұрлым жоғары болса, отбасының (жеке тұлғаның) әлеуметтік әл-ауқаты соғұрлым жоғары.",
      calculateBtn: "Есептеу",
      resetBtn: "Тазарту",
      recalcBtn: "Қайта есептеу",
      exportBtn: "PNG жүктеу",
      resultCategoryLabel: "Санат",
      resultScoreLabel: "Жалпы балл",
      breakdownTitle: "Бағыттар бойынша баллдар",
      footerNote:
        "Есептеу пайдаланушы көрсеткен деректер бойынша жүзеге асырылады. Әдістеме: ҚР Еңбек және халықты әлеуметтік қорғау министрінің 2023 ж. 29 маусымдағы № 267 бұйрығы (2026 ж. 17 маусымдағы № 247 өзгерістерімен). 2026 ж. ПМ: " +
        fmtT(PM_VALUE) +
        ".",
      scoreWord: "балл",
      categories: {
        A: "Әл-ауқаты жақсы",
        B: "Қанағаттанарлық",
        C: "Қанағаттанарлық емес",
        D: "Дағдарыстық",
        E: "Төтенше",
      },
      categoryDesc: {
        A: "Жоғары әлеуметтік әл-ауқат деңгейі бар отбасы (жеке тұлға). Әдетте әлеуметтік қолдау шараларына мұқтаж емес.",
        B: "Жеткілікті әл-ауқат деңгейі бар отбасы (жеке тұлға). Әдетте тұрақты әлеуметтік қолдау шараларына мұқтаж емес.",
        C: "Мұқтаждық белгілері бар отбасы (жеке тұлға). Әлеуметтік қолдау шараларының ықтимал алушылары болуы мүмкін.",
        D: "Айтарлықтай қиындықтарды бастан кешіретін отбасы (жеке тұлға). Әлеуметтік қорғау шараларына ықтимал мұқтаж ретінде қарастырылады.",
        E: "Сыни әлеуметтік әл-ауқат деңгейі бар отбасы (жеке тұлға). Әлеуметтік қолдау шараларының басым алушылары болып табылады.",
      },
      pointsFormat: (n) => (n > 0 ? "+" + n : String(n)),
    },
  };

  // ===== Sections & scales =====
  const SECTIONS = [
    {
      id: 1,
      code: "Пдк",
      color: "#2e7d32",
      title: {
        ru: "Доходы и кредитные обязательства",
        kz: "Табыс және несие міндеттемелері",
      },
      questions: [
        {
          id: "income",
          label: {
            ru:
              "Уровень среднедушевого дохода (ПМ = " +
              fmtT(PM_VALUE) +
              " на 2026 г.)",
            kz:
              "Жан басына шаққандағы орташа табыс деңгейі (ПМ = " +
              fmtT(PM_VALUE) +
              ", 2026 ж.)",
          },
          options: [
            { id: "none", pts: 0, label: { ru: "Нет доходов", kz: "Табыс жоқ" } },
            {
              id: "q1",
              pts: 40,
              label: {
                ru: ">0 – " + fmtT(Math.round(PM_VALUE / 4) - 1) + " (¼ ПМ)",
                kz: ">0 – " + fmtT(Math.round(PM_VALUE / 4) - 1) + " (¼ ПМ)",
              },
            },
            {
              id: "q1_1",
              pts: 100,
              label: {
                ru: pmRange(0.25, 1) + " (¼–1 ПМ)",
                kz: pmRange(0.25, 1) + " (¼–1 ПМ)",
              },
            },
            {
              id: "1_2",
              pts: 170,
              label: {
                ru: pmRange(1, 2) + " (1–2 ПМ)",
                kz: pmRange(1, 2) + " (1–2 ПМ)",
              },
            },
            {
              id: "2_3",
              pts: 280,
              label: {
                ru: pmRange(2, 3) + " (2–3 ПМ)",
                kz: pmRange(2, 3) + " (2–3 ПМ)",
              },
            },
            {
              id: "3_4",
              pts: 400,
              label: {
                ru: pmRange(3, 4) + " (3–4 ПМ)",
                kz: pmRange(3, 4) + " (3–4 ПМ)",
              },
            },
            {
              id: "4p",
              pts: 620,
              label: {
                ru: pmMin(4) + " (≥4 ПМ)",
                kz: pmMin(4) + " (≥4 ПМ)",
              },
            },
          ],
        },
        {
          id: "credit",
          label: { ru: "Кредитные обязательства", kz: "Несие міндеттемелері" },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "yes", pts: 50, label: { ru: "Есть", kz: "Бар" } },
          ],
        },
        {
          id: "overdue",
          label: {
            ru: "Просрочка > 90 дней и > 1 000 ₸",
            kz: "90 күннен асқан және 1 000 ₸-дан асқан мерзімі өткен берешек",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            {
              id: "one",
              pts: -250,
              label: { ru: "У одного взрослого", kz: "Бір ересек адамда" },
            },
            {
              id: "all",
              pts: -500,
              label: { ru: "У всех взрослых", kz: "Барлық ересек адамдарда" },
            },
          ],
        },
      ],
    },
    {
      id: 2,
      code: "Пи",
      color: "#1565c0",
      title: { ru: "Движимое имущество", kz: "Жылжымайтын емес мүлік" },
      questions: [
        {
          id: "cars",
          label: { ru: "Легковые автомобили", kz: "Жеңіл автокөліктер" },
          options: [
            { id: "0", pts: -50, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "1", pts: 0, label: { ru: "1", kz: "1" } },
            { id: "2", pts: 50, label: { ru: "2", kz: "2" } },
            { id: "3p", pts: 100, label: { ru: "3+", kz: "3+" } },
          ],
        },
        {
          id: "commercial_transport",
          label: {
            ru: "Коммерческий транспорт (автобусы, грузовые и др.)",
            kz: "Коммерциялық көлік (автобустар, жүк көліктері және т.б.)",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "yes", pts: 80, label: { ru: "Есть", kz: "Бар" } },
          ],
        },
        {
          id: "agri_tech",
          label: {
            ru: "Сельскохозяйственная техника",
            kz: "Ауыл шаруашылығы техникасы",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            {
              id: "one",
              pts: 100,
              label: { ru: "Один вид", kz: "Бір түрі" },
            },
            {
              id: "two",
              pts: 200,
              label: { ru: "Более двух видов", kz: "Екі түрінен артық" },
            },
          ],
        },
      ],
    },
    {
      id: 3,
      code: "Пз",
      color: "#f9a825",
      title: { ru: "Занятость лиц", kz: "Тұлғалардың жұмыспен қамтылуы" },
      questions: [
        {
          id: "unemployed",
          label: {
            ru: "Трудоспособные неработающие",
            kz: "Еңбекке қабілетті жұмыс істемейтіндер",
          },
          options: [
            {
              id: "no_able",
              pts: -100,
              label: {
                ru: "Нет трудоспособного лица",
                kz: "Еңбекке қабілетті тұлға жоқ",
              },
            },
            {
              id: "has_unemployed",
              pts: 0,
              label: {
                ru: "Есть неработающее",
                kz: "Жұмыс істемейтін адам бар",
              },
            },
          ],
        },
        {
          id: "employed",
          label: { ru: "Работающие лица", kz: "Жұмыс істейтін тұлғалар" },
          options: [
            { id: "0", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "1", pts: 150, label: { ru: "1", kz: "1" } },
            { id: "2p", pts: 300, label: { ru: "≥2", kz: "≥2" } },
          ],
        },
        {
          id: "ip",
          label: {
            ru: "Регистрация в качестве ИП/учредителя",
            kz: "ЖК/құрылтайшы ретінде тіркелу",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "ip", pts: 50, label: { ru: "ИП", kz: "ЖК" } },
            {
              id: "founder",
              pts: 100,
              label: { ru: "Учредитель ТОО/АО", kz: "ЖШС/АҚ құрылтайшысы" },
            },
            {
              id: "both",
              pts: 150,
              label: {
                ru: "Одновременно ИП и учредитель",
                kz: "ЖК және құрылтайшы бір уақытта",
              },
            },
          ],
        },
      ],
    },
    {
      id: 4,
      code: "Псо",
      color: "#c2185b",
      title: { ru: "Социальная защита", kz: "Әлеуметтік қорғау" },
      questions: [
        {
          id: "children",
          label: {
            ru: "Несовершеннолетние дети и учащиеся до 23 лет",
            kz: "Кәмелетке толмаған балалар және 23 жасқа дейінгі оқушылар",
          },
          options: [
            { id: "0", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "1", pts: 50, label: { ru: "1", kz: "1" } },
            { id: "2", pts: 100, label: { ru: "2", kz: "2" } },
            { id: "3", pts: 150, label: { ru: "3", kz: "3" } },
            { id: "4p", pts: 200, label: { ru: "≥4", kz: "≥4" } },
          ],
        },
        {
          id: "disability_adult",
          label: {
            ru: "Лица с инвалидностью старше 18 лет",
            kz: "18 жастан асқан мүгедектер",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            {
              id: "g12",
              pts: -250,
              label: { ru: "1–2 группа", kz: "1–2 топ" },
            },
            {
              id: "g3",
              pts: -100,
              label: { ru: "3 группа", kz: "3 топ" },
            },
          ],
        },
        {
          id: "child_disability",
          label: {
            ru: "Ребёнок с инвалидностью или инвалид с детства",
            kz: "Мүгедек бала немесе балалық шақтан мүгедек",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "yes", pts: -150, label: { ru: "Есть", kz: "Бар" } },
          ],
        },
      ],
    },
    {
      id: 5,
      code: "Пзд",
      color: "#7b1fa2",
      title: { ru: "Здравоохранение", kz: "Денсаулық сақтау" },
      questions: [
        {
          id: "med_attach",
          label: {
            ru: "Прикрепление к медучреждению",
            kz: "Медицина мекемесіне бекіту",
          },
          options: [
            {
              id: "all",
              pts: 0,
              label: { ru: "Все прикреплены", kz: "Барлығы бекітілген" },
            },
            {
              id: "some",
              pts: -20,
              label: {
                ru: "Есть неприкрепленные",
                kz: "Бекітілмегендер бар",
              },
            },
          ],
        },
        {
          id: "osms",
          label: { ru: "Участие в ОСМС", kz: "МСМҚ-ға қатысу" },
          options: [
            {
              id: "yes",
              pts: 0,
              label: { ru: "Есть участники", kz: "Қатысушылар бар" },
            },
            {
              id: "no",
              pts: -20,
              label: { ru: "Нет участников", kz: "Қатысушылар жоқ" },
            },
          ],
        },
        {
          id: "chronic",
          label: {
            ru: "Хронические заболевания (динамическое наблюдение)",
            kz: "Созылмалы аурулар (динамикалық бақылау)",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "yes", pts: -80, label: { ru: "Есть", kz: "Бар" } },
          ],
        },
        {
          id: "dispensary",
          label: { ru: "Диспансерный учёт", kz: "Диспансерлік есеп" },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "yes", pts: -50, label: { ru: "Есть", kz: "Бар" } },
          ],
        },
      ],
    },
    {
      id: 6,
      code: "По",
      color: "#0277bd",
      title: { ru: "Образование", kz: "Білім беру" },
      questions: [
        {
          id: "preschool",
          label: { ru: "Дошкольное образование", kz: "Мектепке дейінгі білім" },
          options: [
            {
              id: "no_kids",
              pts: 0,
              label: { ru: "Нет детей", kz: "Балалар жоқ" },
            },
            {
              id: "attached",
              pts: 0,
              label: { ru: "Прикреплены", kz: "Бекітілген" },
            },
            {
              id: "not_attached",
              pts: -50,
              label: { ru: "Неприкреплены", kz: "Бекітілмеген" },
            },
          ],
        },
        {
          id: "secondary",
          label: { ru: "Среднее образование", kz: "Орта білім" },
          options: [
            {
              id: "no_kids",
              pts: 0,
              label: { ru: "Нет детей", kz: "Балалар жоқ" },
            },
            {
              id: "attached",
              pts: 0,
              label: { ru: "Прикреплены", kz: "Бекітілген" },
            },
            {
              id: "not_attached",
              pts: -100,
              label: { ru: "Неприкреплены", kz: "Бекітілмеген" },
            },
          ],
        },
      ],
    },
    {
      id: 7,
      code: "Пж",
      color: "#2e7d32",
      title: {
        ru: "Жилищные условия и инфраструктура",
        kz: "Тұрғын үй жағдайлары және инфрақұрылым",
      },
      questions: [
        {
          id: "housing",
          label: { ru: "Обеспеченность жильём", kz: "Тұрғын үймен қамтамасыз ету" },
          options: [
            {
              id: "none",
              pts: -200,
              label: { ru: "Нет жилья", kz: "Тұрғын үй жоқ" },
            },
            {
              id: "lt18",
              pts: -80,
              label: {
                ru: "< 18 м² на человека",
                kz: "Адамға 18 м²-ден аз",
              },
            },
            {
              id: "ge18",
              pts: 50,
              label: {
                ru: "≥ 18 м² на человека",
                kz: "Адамға 18 м² және одан көп",
              },
            },
            {
              id: "2_3",
              pts: 100,
              label: { ru: "2–3 объекта", kz: "2–3 нысан" },
            },
            {
              id: "3_6",
              pts: 400,
              label: { ru: "3–6 объектов", kz: "3–6 нысан" },
            },
            {
              id: "6_11",
              pts: 1000,
              label: { ru: "6–11 объектов", kz: "6–11 нысан" },
            },
            {
              id: "gt11",
              pts: 2000,
              label: { ru: "> 11 объектов", kz: "11 нысаннан көп" },
            },
          ],
        },
        {
          id: "commercial_re",
          label: {
            ru: "Коммерческая недвижимость",
            kz: "Коммерциялық жылжымайтын мүлік",
          },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "yes", pts: 80, label: { ru: "Есть", kz: "Бар" } },
          ],
        },
        {
          id: "settlement",
          label: {
            ru: "Статус населённого пункта",
            kz: "Елді мекен мәртебесі",
          },
          options: [
            {
              id: "capital",
              pts: 70,
              label: {
                ru: "Столица, город респ. значения",
                kz: "Астана, респ. маңызы бар қала",
              },
            },
            {
              id: "obl",
              pts: 0,
              label: {
                ru: "Город обл. значения",
                kz: "Обл. маңызы бар қала",
              },
            },
            {
              id: "district",
              pts: -30,
              label: {
                ru: "Район, город районного значения",
                kz: "Аудан, аудандық маңызы бар қала",
              },
            },
            {
              id: "rural_okrug",
              pts: -50,
              label: { ru: "Сельский округ", kz: "Ауылдық округ" },
            },
            {
              id: "rural",
              pts: -70,
              label: {
                ru: "Сельский населённый пункт",
                kz: "Ауылдық елді мекен",
              },
            },
            {
              id: "unreg",
              pts: -100,
              label: { ru: "Не зарегистрирован", kz: "Тіркелмеген" },
            },
          ],
        },
      ],
    },
    {
      id: 8,
      code: "Псх",
      color: "#ef6c00",
      title: { ru: "Сельское хозяйство", kz: "Ауыл шаруашылығы" },
      questions: [
        {
          id: "lph",
          label: {
            ru: "Личное подсобное хозяйство (стоимость)",
            kz: "Жеке қосалқы шаруашылық (құны)",
          },
          options: [
            { id: "none", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            {
              id: "lt500",
              pts: 50,
              label: { ru: "< 500 тыс. ₸", kz: "500 мың ₸-дан аз" },
            },
            {
              id: "500_1m",
              pts: 150,
              label: {
                ru: "500 тыс. – 1 млн ₸",
                kz: "500 мың – 1 млн ₸",
              },
            },
            {
              id: "1_2m",
              pts: 350,
              label: { ru: "1–2 млн ₸", kz: "1–2 млн ₸" },
            },
            {
              id: "gt2m",
              pts: 600,
              label: { ru: "> 2 млн ₸", kz: "2 млн ₸-дан көп" },
            },
          ],
        },
        {
          id: "land",
          label: { ru: "Земельный участок", kz: "Жер учаскесі" },
          options: [
            { id: "no", pts: 0, label: { ru: "Нет", kz: "Жоқ" } },
            { id: "yes", pts: 150, label: { ru: "Есть", kz: "Бар" } },
          ],
        },
      ],
    },
  ];

  const CATEGORIES = [
    { id: "A", min: 1800, max: Infinity, color: "#2e7d32" },
    { id: "B", min: 730, max: 1799, color: "#1565c0" },
    { id: "C", min: -30, max: 729, color: "#f9a825" },
    { id: "D", min: -460, max: -29, color: "#ef6c00" },
    { id: "E", min: -Infinity, max: -459, color: "#c62828" },
  ];

  function getCategory(score) {
    // Contiguous ranges; boundaries follow the infographic labels
    // A ≥1800, B 730–1799, C −30–729, D −458–−31, E ≤−459
    if (score >= 1800) return CATEGORIES.find((c) => c.id === "A");
    if (score >= 730) return CATEGORIES.find((c) => c.id === "B");
    if (score >= -30) return CATEGORIES.find((c) => c.id === "C");
    if (score >= -458) return CATEGORIES.find((c) => c.id === "D");
    return CATEGORIES.find((c) => c.id === "E");
  }

  // ===== App state =====
  let lang = "ru";
  let lastResult = null;

  // ===== DOM refs =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ===== i18n apply =====
  function t(key) {
    return i18n[lang][key];
  }

  function applyLang() {
    document.documentElement.lang = lang === "kz" ? "kk" : "ru";
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = i18n[lang][key];
      if (typeof val === "string") el.textContent = val;
    });
    $$(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    renderForm();
    if (lastResult) renderResult(lastResult);
  }

  // ===== Form render =====
  function renderForm() {
    const root = $("#sections-root");
    root.innerHTML = "";
    SECTIONS.forEach((sec) => {
      const secEl = document.createElement("section");
      secEl.className = "form-section";
      secEl.dataset.section = String(sec.id);

      const head = document.createElement("div");
      head.className = "section-head";
      head.innerHTML =
        '<div class="section-num">' +
        sec.id +
        '</div><div><h2>' +
        escapeHtml(sec.title[lang]) +
        '</h2><span class="section-code">' +
        escapeHtml(sec.code) +
        "</span></div>";
      secEl.appendChild(head);

      sec.questions.forEach((q) => {
        const qEl = document.createElement("div");
        qEl.className = "question";

        const label = document.createElement("div");
        label.className = "question-label";
        label.textContent = q.label[lang];
        qEl.appendChild(label);

        const group = document.createElement("div");
        group.className = "chip-group";

        q.options.forEach((opt, idx) => {
          const chip = document.createElement("label");
          chip.className = "chip";
          const input = document.createElement("input");
          input.type = "radio";
          input.name = sec.id + "_" + q.id;
          input.value = opt.id;
          input.checked = idx === 0;
          input.dataset.points = String(opt.pts);

          const span = document.createElement("span");
          const ptsTxt = i18n[lang].pointsFormat(opt.pts);
          span.innerHTML =
            escapeHtml(opt.label[lang]) +
            ' <span class="pts">' +
            escapeHtml(ptsTxt) +
            "</span>";

          chip.appendChild(input);
          chip.appendChild(span);
          group.appendChild(chip);
        });

        qEl.appendChild(group);
        secEl.appendChild(qEl);
      });

      root.appendChild(secEl);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ===== Calculate =====
  function calculate() {
    const breakdown = [];
    let total = 0;

    SECTIONS.forEach((sec) => {
      let secTotal = 0;
      sec.questions.forEach((q) => {
        const selected = document.querySelector(
          'input[name="' + sec.id + "_" + q.id + '"]:checked'
        );
        const pts = selected ? Number(selected.dataset.points) : 0;
        secTotal += pts;
      });
      breakdown.push({
        id: sec.id,
        code: sec.code,
        title: sec.title[lang],
        points: secTotal,
      });
      total += secTotal;
    });

    const cat = getCategory(total);
    lastResult = { total, breakdown, catId: cat.id, color: cat.color };
    renderResult(lastResult);

    const resultEl = $("#result");
    resultEl.classList.remove("hidden");
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderResult(res) {
    const cat = CATEGORIES.find((c) => c.id === res.catId);
    const hero = $("#result-hero");
    hero.style.setProperty("--result-color", cat.color);

    $("#result-letter").textContent = res.catId;
    $("#result-name").textContent = i18n[lang].categories[res.catId];
    $("#result-score").textContent = String(res.total);
    $("#result-desc").textContent = i18n[lang].categoryDesc[res.catId];

    const bd = $("#breakdown");
    bd.innerHTML = "";
    res.breakdown.forEach((item) => {
      const el = document.createElement("div");
      el.className = "breakdown-item";
      el.dataset.section = String(item.id);
      const cls = item.points > 0 ? "pos" : item.points < 0 ? "neg" : "zero";
      el.innerHTML =
        '<div class="breakdown-name">' +
        escapeHtml(item.code + " · " + item.title) +
        '</div><div class="breakdown-val ' +
        cls +
        '">' +
        escapeHtml(i18n[lang].pointsFormat(item.points)) +
        "</div>";
      bd.appendChild(el);
    });
  }

  // ===== Export PNG =====
  function getAppUrl() {
    if (location.protocol === "http:" || location.protocol === "https:") {
      return location.origin + location.pathname;
    }
    return "lifelens-social-calculator";
  }

  function exportPng() {
    if (!lastResult) return;

    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    const cat = CATEGORIES.find((c) => c.id === lastResult.catId);
    const color = cat.color;
    const light = mixColor(color, "#ffffff", 0.72);
    const dark = mixColor(color, "#1c2433", 0.35);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, light);
    bgGrad.addColorStop(0.55, mixColor(color, "#ffffff", 0.88));
    bgGrad.addColorStop(1, "#ffffff");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative circles
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = color;
    [[-80, -60, 320], [W - 160, 120, 240], [80, H - 220, 280], [W - 60, H - 120, 200]].forEach(
      ([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    );
    ctx.restore();

    // Card
    const cardX = 56;
    const cardY = 56;
    const cardW = W - 112;
    const cardH = H - 112;
    roundRect(ctx, cardX, cardY, cardW, cardH, 36);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fill();
    ctx.strokeStyle = "rgba(28,36,51,0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Header strip
    roundRect(ctx, cardX, cardY, cardW, 190, 36);
    ctx.save();
    ctx.clip();
    const headGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + 190);
    headGrad.addColorStop(0, color);
    headGrad.addColorStop(1, dark);
    ctx.fillStyle = headGrad;
    ctx.fillRect(cardX, cardY, cardW, 190);
    ctx.restore();

    // Title on strip
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 36px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(t("appTitle"), cardX + 48, cardY + 70);

    ctx.font = "500 24px 'Segoe UI', system-ui, sans-serif";
    ctx.globalAlpha = 0.9;
    ctx.fillText(t("appSubtitle"), cardX + 48, cardY + 118);
    ctx.globalAlpha = 1;

    // Big letter
    const letterY = cardY + 190 + 110;
    roundRect(ctx, cardX + 48, letterY - 70, 140, 140, 28);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 84px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(res_catId(), cardX + 48 + 70, letterY + 4);

    // Category name + score
    ctx.textAlign = "left";
    ctx.fillStyle = "#1c2433";
    ctx.font = "700 44px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(i18n[lang].categories[res_catId()], cardX + 220, letterY - 18);

    ctx.fillStyle = "#5b6779";
    ctx.font = "600 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(t("resultScoreLabel"), cardX + 220, letterY + 28);

    ctx.fillStyle = color;
    ctx.font = "800 56px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(String(lastResult.total), cardX + 220, letterY + 82);

    // Description
    let y = letterY + 150;
    ctx.fillStyle = "#5b6779";
    ctx.font = "400 22px 'Segoe UI', system-ui, sans-serif";
    y = wrapText(ctx, i18n[lang].categoryDesc[res_catId()], cardX + 48, y, cardW - 96, 32);

    // Breakdown title
    y += 28;
    ctx.fillStyle = "#1c2433";
    ctx.font = "700 26px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(t("breakdownTitle"), cardX + 48, y);
    y += 18;

    // Breakdown rows
    const rowH = 52;
    const colW = (cardW - 96 - 24) / 2;
    lastResult.breakdown.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const rx = cardX + 48 + col * (colW + 24);
      const ry = y + row * rowH;

      roundRect(ctx, rx, ry, colW, rowH - 10, 12);
      ctx.fillStyle = "#f4f6fb";
      ctx.fill();

      ctx.fillStyle = "#5b6779";
      ctx.font = "600 18px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const name = item.code + " · " + item.title;
      ctx.fillText(truncate(ctx, name, colW - 90), rx + 16, ry + (rowH - 10) / 2);

      const ptsTxt = i18n[lang].pointsFormat(item.points);
      ctx.fillStyle =
        item.points > 0 ? "#2e7d32" : item.points < 0 ? "#c62828" : "#5b6779";
      ctx.font = "700 20px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(ptsTxt, rx + colW - 16, ry + (rowH - 10) / 2);
    });

    y += Math.ceil(lastResult.breakdown.length / 2) * rowH + 10;

    // Footer
    const footerY = cardY + cardH - 90;
    ctx.strokeStyle = "rgba(28,36,51,0.1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 48, footerY - 20);
    ctx.lineTo(cardX + cardW - 48, footerY - 20);
    ctx.stroke();

    ctx.fillStyle = "#5b6779";
    ctx.font = "500 20px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const dateStr = new Date().toLocaleDateString(
      lang === "kz" ? "kk-KZ" : "ru-RU",
      { year: "numeric", month: "long", day: "numeric" }
    );
    ctx.fillText(dateStr, cardX + 48, footerY);

    ctx.textAlign = "right";
    ctx.fillStyle = color;
    ctx.font = "700 20px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(getAppUrl(), cardX + cardW - 48, footerY);

    canvas.toBlob(function (blob) {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "social-wellbeing-" + res_catId().toLowerCase() + ".png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, "image/png");
  }

  function res_catId() {
    return lastResult ? lastResult.catId : "A";
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(/\s+/);
    let line = "";
    let cy = y;
    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, cy);
        cy += lineHeight;
        line = word;
      } else {
        line = test;
      }
    });
    if (line) {
      ctx.fillText(line, x, cy);
      cy += lineHeight;
    }
    return cy;
  }

  function truncate(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let s = text;
    while (s.length > 1 && ctx.measureText(s + "…").width > maxWidth) {
      s = s.slice(0, -1);
    }
    return s + "…";
  }

  function mixColor(hexA, hexB, weightA) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a.r * weightA + b.r * (1 - weightA));
    const g = Math.round(a.g * weightA + b.g * (1 - weightA));
    const bl = Math.round(a.b * weightA + b.b * (1 - weightA));
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  // ===== Events =====
  function bindEvents() {
    $$(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        lang = btn.dataset.lang;
        applyLang();
      });
    });

    $("#calc").addEventListener("submit", (e) => {
      e.preventDefault();
      calculate();
    });

    $("#reset-btn").addEventListener("click", () => {
      $("#calc").reset();
      // Re-check first option of each question
      renderForm();
      $("#result").classList.add("hidden");
      lastResult = null;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    $("#recalc-btn").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    $("#export-btn").addEventListener("click", exportPng);
  }

  // ===== Init =====
  function init() {
    applyLang();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
