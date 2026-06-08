import React, { useState } from 'react';
import { Camera, Heart, MessageCircle, ExternalLink, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { InstagramPost } from '../types';
import { LanguageCode } from '../translations';
import doctorProfile from '../../images/drhuseyinblikci.jpg';

interface InstagramFeedProps {
  lang: LanguageCode;
}

const POST_CAPTIONS: Record<string, Record<LanguageCode, { caption: string; date: string }>> = {
  p1: {
    fr: {
      caption: "Vos publications… Nez semi-barbie 3 mois après une #rhinoplastie primaire",
      date: "10 décembre 2025"
    },
    en: {
      caption: "Your posts… semi-barbie nose 3 months after primary #rhinoplasty",
      date: "December 10, 2025"
    },
    es: {
      caption: "Tus publicaciones… Nariz semi-barbie 3 meses después de la #rinoplastia primaria",
      date: "10 de diciembre de 2025"
    },
    ru: {
      caption: "Ваши публикации… Полу-Барби нос через 3 месяца после первичной #ринопластики",
      date: "10 декабря 2025"
    },
    pl: {
      caption: "Twoje posty… Nos semi-barbie 3 miesiące po pierwotnej #korekcjanosa",
      date: "10 grudnia 2025"
    },
    de: {
      caption: "Ihre Beiträge… Semi-Barbie-Nase 3 Monate nach primärer #Nasenkorrektur",
      date: "10. Dezember 2025"
    },
    ja: {
      caption: "あなたの投稿… 初回の#鼻形成術から3ヶ月後のセミバービノーズ",
      date: "2025年12月10日"
    },
    ko: {
      caption: "여러분의 게시물… 1차 #코성형 후 3개월 된 세미바비 코",
      date: "2025년 12월 10일"
    },
    ar: {
      caption: "منشوراتكم… أنف شبه باربي بعد 3 أشهر من #تجميل_الأنف الأولي",
      date: "١٠ ديسمبر ٢٠٢٥"
    }
  },
  p2: {
    fr: {
      caption: "Nez d'homme. Notre patient vient d'#Allemagne🇩🇪 #RhinoplastieSecondaire avec greffe costale",
      date: "3 juin 2026"
    },
    en: {
      caption: "Male nose Our patient is from #germany🇩🇪 Rib #revisionrhinoplasty",
      date: "June 3, 2026"
    },
    es: {
      caption: "Nariz masculina. Nuestro paciente es de #Alemania🇩🇪 #RinoplastiaDeRevisión con costilla",
      date: "3 de junio de 2026"
    },
    ru: {
      caption: "Мужской нос. Наш пациент из #Германии🇩🇪 Ревизионная #ринопластика с реберным хрящом",
      date: "3 июня 2026"
    },
    pl: {
      caption: "Nos męski. Nasz pacjent jest z #Niemiec🇩🇪 #KorekcjaWtórna nosa z użyciem chrząstki żebrowej",
      date: "3 czerwca 2026"
    },
    de: {
      caption: "Männernase. Unser Patient kommt aus #Deutschland🇩🇪 Rippenknorpel-#Revisionsnasenkorrektur",
      date: "3. Juni 2026"
    },
    ja: {
      caption: "男性の鼻。患者様は#ドイツ🇩🇪出身。肋骨移植による#修正鼻形成術",
      date: "2026年6月3日"
    },
    ko: {
      caption: "남성 코. 저희 환자는 #독일🇩🇪에서 오셨습니다. 늑연골 #코재수술",
      date: "2026년 6월 3일"
    },
    ar: {
      caption: "أنف رجالي. مريضنا من #ألمانيا🇩🇪 #تجميل_أنف_ثانوي باستخدام غضروف الضلع",
      date: "٣ يونيو ٢٠٢٦"
    }
  },
  p3: {
    fr: {
      caption: "Nez semi-barbie 2 ans après l'opération… UNE CHIRURGIE PAR JOUR. UN PATIENT À LA FOIS.",
      date: "28 mai 2026"
    },
    en: {
      caption: "Semi-barbie nose 2 years postop… ONE SURGERY PER DAY. ONE PATIENT AT A TIME.",
      date: "May 28, 2026"
    },
    es: {
      caption: "Nariz semi-barbie 2 años después de la cirugía… UNA CIRUGÍA POR DÍA. UN PACIENTE A LA VEZ.",
      date: "28 de mayo de 2026"
    },
    ru: {
      caption: "Полу-Барби нос через 2 года после операции… ОДНА ОПЕРАЦИЯ В ДЕНЬ. ОДИН ПАЦИЕНТ ЗА РАЗ.",
      date: "28 мая 2026"
    },
    pl: {
      caption: "Nos semi-barbie 2 lata po operacji… JEDNA OPERACJA DZIENNIE. JEDEN PACJENT NARAZ.",
      date: "28 maja 2026"
    },
    de: {
      caption: "Semi-Barbie-Nase 2 Jahre nach OP… EINE OPERATION PRO TAG. EIN PATIENT AUF EINMAL.",
      date: "28. Mai 2026"
    },
    ja: {
      caption: "術後2年のセミバービノーズ… 1日1手術。一度に1人の患者様。",
      date: "2026年5月28日"
    },
    ko: {
      caption: "수술 후 2년 된 세미바비 코… 하루 한 번의 수술. 한 번에 한 명의 환자.",
      date: "2026년 5월 28일"
    },
    ar: {
      caption: "أنف شبه باربي بعد عامين من الجراحة… عملية جراحية واحدة في اليوم. مريض واحد في كل مرة.",
      date: "٢٨ مايو ٢٠٢٦"
    }
  },
  p4: {
    fr: {
      caption: "UNE CHIRURGIE PAR JOUR ! Transformer un nez long, floppy, surprojeté avec des dômes divergents et des crus médiaux faibles en un nez plus court, plus petit, plus raffiné et élégant est l'un des plus grands exercices d'équilibre en rhinoplastie. Dans ce cas de belle collègue, nous avons visé non seulement à déprojeter et raccourcir le nez en réduisant l'axe coronal, mais aussi à préserver — et même améliorer — la définition de la pointe malgré des manœuvres de réduction significatives. Le défi ? Lorsque vous réduisez simultanément la projection, le volume, la taille des narines et la longueur globale, la définition peut facilement être perdue. Surtout dans les nez avec un soutien structurel faible et une anatomie de la pointe mal définie. Grâce à un remodelage structurel, un raffinement des dômes, un soutien des crus médiaux et un contrôle précis des proportions, nous avons obtenu un nez plus doux, plus court et plus féminin tout en maintenant une réflexion élégante de la lumière, une définition de la pointe et une harmonie faciale naturelle. La réduction esthétique ne devrait jamais signifier perdre son identité, son caractère ou sa définition. #rhinoplastie #rhinoplastiesecondaire",
      date: "7 mai 2026"
    },
    en: {
      caption: "ONE SURGERY PER DAY! Turning an overprojected, long, floppy nose with divergent domes and weak medial crura into a shorter, smaller, more refined and elegant nose is one of the greatest balancing acts in rhinoplasty. In this beautiful colleague case, we aimed not only to deproject and shorten the nose by reducing the coronal axis, but also to preserve — and even enhance — tip definition despite significant reduction maneuvers. The challenge? When you reduce projection, volume, nostril size and overall length simultaneously, definition can easily be lost. Especially in noses with weak structural support and poorly defined tip anatomy. Through structural reshaping, dome refinement, medial crural support and precise proportion control, we achieved a softer, shorter, more feminine nose while maintaining elegant light reflection, tip definition and natural facial harmony. Aesthetic reduction should never mean losing identity, character or definition. #rhinoplasty #revisionrhinoplasty",
      date: "May 7, 2026"
    },
    es: {
      caption: "¡UNA CIRUGÍA POR DÍA! Convertir una nariz sobreproyectada, larga, flácida con domos divergentes y crura mediales débiles en una nariz más corta, pequeña, refinada y elegante es uno de los mayores actos de equilibrio en rinoplastia. En este hermoso caso de una colega, nuestro objetivo no solo fue desproyectar y acortar la nariz reduciendo el eje coronal, sino también preservar — e incluso mejorar — la definición de la punta a pesar de maniobras de reducción significativas. ¿El desafío? Cuando reduces simultáneamente la proyección, el volumen, el tamaño de las fosas nasales y la longitud general, la definición puede perderse fácilmente. Especialmente en narices con soporte estructural débil y anatomía de la punta mal definida. Mediante remodelación estructural, refinamiento de los domos, soporte de las crura mediales y control preciso de las proporciones, logramos una nariz más suave, corta y femenina mientras manteníamos un elegante reflejo de la luz, definición de la punta y armonía facial natural. La reducción estética nunca debería significar perder identidad, carácter o definición. #rinoplastia #rinoplastiarevision",
      date: "7 de mayo de 2026"
    },
    ru: {
      caption: "ОДНА ОПЕРАЦИЯ В ДЕНЬ! Превратить чрезмерно выступающий, длинный, мягкий нос с расходящимися куполами и слабыми медиальными ножками в более короткий, меньший, более изящный и элегантный нос — один из величайших балансирующих актов в ринопластике. В этом прекрасном случае коллеги мы стремились не только уменьшить проекцию и укоротить нос за счет сокращения корональной оси, но и сохранить — и даже улучшить — кончик, несмотря на значительные редукционные маневры. В чем проблема? Когда вы одновременно уменьшаете проекцию, объем, размер ноздрей и общую длину, четкость кончика легко теряется. Особенно в носах со слабой структурной поддержкой и плохо выраженной анатомией кончика. Благодаря структурному изменению формы, уточнению куполов, поддержке медиальных ножек и точному контролю пропорций мы достигли более мягкого, короткого, женственного носа, сохраняя элегантное отражение света, четкость кончика и естественную гармонию лица. Эстетическое уменьшение никогда не должно означать потерю индивидуальности, характера или четкости. #ринопластика #ревизионнаяринопластика",
      date: "7 мая 2026"
    },
    pl: {
      caption: "JEDNA OPERACJA DZIENNIE! Przekształcenie zbyt wysuniętego, długiego, wiotkiego nosa z rozbieżnymi kopułami i słabymi odnóżami przyśrodkowymi w krótszy, mniejszy, bardziej wyrafinowany i elegancki nos to jeden z największych aktów równowagi w korekcji nosa. W tym pięknym przypadku koleżanki, naszym celem było nie tylko zmniejszenie projekcji i skrócenie nosa poprzez redukcję osi koronalnej, ale także zachowanie — a nawet poprawa — definicji czubka pomimo znaczących manewrów redukcyjnych. Wyzwanie? Kiedy jednocześnie zmniejszasz projekcję, objętość, rozmiar nozdrzy i całkowitą długość, definicja może łatwo zostać utracona. Szczególnie w nosach ze słabym wsparciem strukturalnym i słabo zdefiniowaną anatomią czubka. Poprzez restrukturyzację kształtu, udoskonalenie kopuł, wsparcie odnóż przyśrodkowych i precyzyjną kontrolę proporcji, uzyskaliśmy bardziej miękki, krótszy, bardziej kobiecy nos, zachowując eleganckie odbicie światła, definicję czubka i naturalną harmonię twarzy. Estetyczna redukcja nigdy nie powinna oznaczać utraty tożsamości, charakteru ani definicji. #korekcjanosa #korekcjawtórna",
      date: "7 maja 2026"
    },
    de: {
      caption: "EINE OPERATION PRO TAG! Eine überprojizierte, lange, schlaffe Nase mit divergierenden Domus und schwachen medialen Crura in eine kürzere, kleinere, verfeinerte und elegantere Nase zu verwandeln, ist eine der größten Balanceakte in der Nasenkorrektur. In diesem schönen Fall einer Kollegin wollten wir nicht nur die Projektion reduzieren und die Nase durch Verringerung der Koronarachse verkürzen, sondern auch die Spitzen-Definition trotz erheblicher Reduktionsmanöver erhalten — und sogar verbessern. Die Herausforderung? Wenn Sie gleichzeitig Projektion, Volumen, Nasenlochgröße und Gesamtlänge reduzieren, kann die Definition leicht verloren gehen. Besonders bei Nasen mit schwacher struktureller Unterstützung und schlecht definierter Spitzenanatomie. Durch strukturelle Umformung, Domverfeinerung, Unterstützung der medialen Crura und präzise Proportionskontrolle erreichten wir eine weichere, kürzere, femininere Nase, während wir elegante Lichtreflexion, Spitzendefinition und natürliche Gesichtsharmonie beibehielten. Ästhetische Reduktion sollte niemals bedeuten, Identität, Charakter oder Definition zu verlieren. #nasenkorrektur #revisionsnasenkorrektur",
      date: "7. Mai 2026"
    },
    ja: {
      caption: "1日1手術！突出が強く、長く、柔らかく、ドームが分岐し、内側脚が弱い鼻を、より短く、小さく、洗練されたエレガントな鼻に変えることは、鼻形成術における最も偉大なバランス芸術の一つです。この美しい同業者の症例では、冠状軸を減らすことで鼻の突出を減らし短くするだけでなく、大幅な縮小手技にもかかわらず、先端の定義を保存し、さらに強化することを目指しました。課題は？突出、ボリューム、鼻孔のサイズ、全長を同時に減少させると、定義が簡単に失われる可能性があります。特に、構造的サポートが弱く、先端の解剖学的構造が不明瞭な鼻では。構造的再形成、ドームの洗練、内側脚のサポート、正確なプロポーションコントロールを通じて、エレガントな光の反射、先端の定義、自然な顔の調和を維持しながら、より柔らかく、短く、女性的な鼻を達成しました。美的縮小は決してアイデンティティ、キャラクター、または定義を失うことを意味するべきではありません。 #鼻形成術 #修正鼻形成術",
      date: "2026年5月7日"
    },
    ko: {
      caption: "하루 한 번의 수술! 과도하게 돌출되고, 길고, 처진 코와 갈라진 돔 및 약한 내측각을 더 짧고, 작고, 세련되고 우아한 코로 바꾸는 것은 코성형에서 가장 중요한 균형 잡기 중 하나입니다. 이 아름다운 동료 사례에서 우리는 관상축을 줄여 코의 돌출을 줄이고 짧게 하는 것뿐만 아니라, 상당한 축소 조작에도 불구하고 코끝의 정의를 보존하고 심지어 향상시키는 것을 목표로 했습니다. 도전 과제는? 돌출, 부피, 콧구멍 크기 및 전체 길이를 동시에 줄이면 정의가 쉽게 손실될 수 있습니다. 특히 구조적 지지력이 약하고 코끝 해부학이 제대로 정의되지 않은 코에서 그렇습니다. 구조적 재형성, 돔 세련, 내측각 지지 및 정확한 비율 제어를 통해 우리는 우아한 빛 반사, 코끝 정의 및 자연스러운 안면 조화를 유지하면서 더 부드럽고, 짧고, 여성스러운 코를 달성했습니다. 미적 축소는 결코 정체성, 특성 또는 정의를 잃는 것을 의미해서는 안 됩니다. #코성형 #코재수술",
      date: "2026년 5월 7일"
    },
    ar: {
      caption: "عملية جراحية واحدة في اليوم! تحويل أنف طويل، مترهل، مفرط الإسقاط مع قباب متباعدة وسيقان إنسية ضعيفة إلى أنف أقصر وأصغر وأكثر أناقة ورقيًا هو أحد أعظم أعمال التوازن في تجميل الأنف. في حالة الزميلة الجميلة هذه، لم نهدف فقط إلى تقليل الإسقاط وتقصير الأنف عن طريق تقليل المحور الإكليلي، ولكن أيضًا الحفاظ على تعريف الأرنبة - بل وتحسينه - على الرغم من عمليات التصغير الكبيرة. التحدي؟ عندما تقوم بتقليل الإسقاط والحجم وحجم فتحتي الأنف والطول الإجمالي في وقت واحد، يمكن فقدان التعريف بسهولة. خاصة في الأنوف ذات الدعم الهيكلي الضعيف وتشريح الأرنبة ضعيف التعريف. من خلال إعادة التشكيل الهيكلي، وتحسين القبة، ودعم السيقان الإنسية والتحكم الدقيق في النسب، حققنا أنفًا أكثر نعومة وقصرًا وأنوثة مع الحفاظ على انعكاس الضوء الأنيق، وتعريف الأرنبة والتناغم الطبيعي للوجه. لا ينبغي أن يعني التصغير التجميلي أبدًا فقدان الهوية أو الشخصية أو التعريف. #تجميل_الأنف #تجميل_الأنف_الثانوي",
      date: "٧ مايو ٢٠٢٦"
    }
  },
  p5: {
    fr: {
      caption: "UNE CHIRURGIE PAR JOUR ! Peau super épaisse #RhinoplastieSecondaire avec greffe costale 4ème #rhinoplastiederevision #rhinoplastie",
      date: "6 mai 2026"
    },
    en: {
      caption: "ONE SURGERY PER DAY! Super thick skin Rib #revisionrhinoplasty 4th #revisionrhinoplasty #rhinoplasty",
      date: "May 6, 2026"
    },
    es: {
      caption: "¡UNA CIRUGÍA POR DÍA! Piel super gruesa #RinoplastiaDeRevisión con costilla 4ª #rinoplastiarevision #rinoplastia",
      date: "6 de mayo de 2026"
    },
    ru: {
      caption: "ОДНА ОПЕРАЦИЯ В ДЕНЬ! Супер толстая кожа Реберный хрящ #ревизионнаяринопластика 4-я #ревизионнаяринопластика #ринопластика",
      date: "6 мая 2026"
    },
    pl: {
      caption: "JEDNA OPERACJA DZIENNIE! Super gruba skóra Chrząstka żebrowa #korekcjawtórna 4-ta #korekcjawtórna #korekcjanosa",
      date: "6 maja 2026"
    },
    de: {
      caption: "EINE OPERATION PRO TAG! Super dicke Haut Rippenknorpel #Revisionsnasenkorrektur 4. #Revisionsnasenkorrektur #Nasenkorrektur",
      date: "6. Mai 2026"
    },
    ja: {
      caption: "1日1手術！超厚い皮膚 肋骨移植 #修正鼻形成術 4回目の #修正鼻形成術 #鼻形成術",
      date: "2026年5月6日"
    },
    ko: {
      caption: "하루 한 번의 수술! 매우 두꺼운 피부 늑연골 #코재수술 4번째 #코재수술 #코성형",
      date: "2026년 5월 6일"
    },
    ar: {
      caption: "عملية جراحية واحدة في اليوم! جلد سميك جدًا غضروف الضلع #تجميل_الأنف_الثانوي الرابع #تجميل_الأنف_الثانوي #تجميل_الأنف",
      date: "٦ مايو ٢٠٢٦"
    }
  },
  p6: {
    fr: {
      caption: "Voici mes photos (+ 1 photo bonus 😻) un mois après la chirurgie. C'est encore gonflé, surtout autour de la racine du nez, mais je suis déjà très heureux de l'amélioration par rapport à mon nez avant la #RhinoplastieSecondaire avec greffe costale",
      date: "17 mai 2026"
    },
    en: {
      caption: "Here are my photos (+ 1 bonus photo 😻) one month after the surgery. It's still swollen, especially around the radix, but I'm already very happy with the improvement compared to my nose before Rib #revisionrhinoplasty",
      date: "May 17, 2026"
    },
    es: {
      caption: "Aquí están mis fotos (+ 1 foto extra 😻) un mes después de la cirugía. Todavía está hinchado, especialmente alrededor de la raíz nasal, pero ya estoy muy feliz con la mejora en comparación con mi nariz antes de la #RinoplastiaDeRevisión con costilla",
      date: "17 de mayo de 2026"
    },
    ru: {
      caption: "Вот мои фотографии (+ 1 бонусное фото 😻) через месяц после операции. Все еще отек, особенно вокруг корня носа, но я уже очень доволен улучшением по сравнению с моим носом до реберной #ревизионнойринопластики",
      date: "17 мая 2026"
    },
    pl: {
      caption: "Oto moje zdjęcia (+ 1 bonusowe zdjęcie 😻) miesiąc po operacji. Wciąż jest spuchnięte, szczególnie w okolicy nasady nosa, ale już jestem bardzo zadowolony z poprawy w porównaniu z moim nosem przed #korekcjawtórną z chrząstką żebrową",
      date: "17 maja 2026"
    },
    de: {
      caption: "Hier sind meine Fotos (+ 1 Bonusfoto 😻) einen Monat nach der Operation. Es ist noch geschwollen, besonders um die Nasenwurzel, aber ich bin schon sehr glücklich über die Verbesserung im Vergleich zu meiner Nase vor der Rippenknorpel-#Revisionsnasenkorrektur",
      date: "17. Mai 2026"
    },
    ja: {
      caption: "手術から1ヶ月後の写真です（+ボーナス写真1枚😻）。特に鼻根周りはまだ腫れていますが、肋骨移植による#修正鼻形成術の前と比べて改善され、とても満足しています。",
      date: "2026年5月17日"
    },
    ko: {
      caption: "수술 한 달 후 제 사진입니다 (+ 보너스 사진 1장 😻). 특히 코 뿌리 주변이 여전히 부어 있지만, 늑연골 #코재수술 전의 제 코와 비교하면 개선된 점에 이미 매우 만족하고 있습니다.",
      date: "2026년 5월 17일"
    },
    ar: {
      caption: "هذه صوري (+ صورة إضافية 😻) بعد شهر واحد من الجراحة. لا يزال هناك تورم، خاصة حول جذر الأنف، لكنني سعيد جدًا بالفعل بالتحسن مقارنة بأنفي قبل #تجميل_الأنف_الثانوي بغضروف الضلع",
      date: "١٧ مايو ٢٠٢٦"
    }
  }
};

const MOCK_METADATA = {
  p1: { imageUrl: "https://instagram.fcmn1-4.fna.fbcdn.net/v/t51.82787-15/597897713_18544455868009213_9147944482899771011_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzc4NDMyNDc3ODM1NDgyNzg4Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=5dcRN64kCk8Q7kNvwHjmAPN&_nc_oc=Adofs7ag6mw6Arz86U7Ft1c2VXORkbCE-SvvTzg3rVRT2em8OrkcFEU6EuQPgnpWFMs&_nc_ad=z-m&_nc_cid=1404&_nc_zt=23&_nc_ht=instagram.fcmn1-4.fna&_nc_gid=FTb4TL36XZLmkF3Na-UNWA&_nc_ss=7a22e&oh=00_Af834F825rQcKoypUoOLfUZDh2Bl_Hn6JxezKG_xTMe7IA&oe=6A2920ED", likes: 1342, commentsCount: 93, permalink: "https://www.instagram.com/drhuseyinbalikci/p/DSFmUj1jMOH/" },
  p2: { imageUrl: "https://instagram.fcmn1-2.fna.fbcdn.net/v/t51.82787-15/715450457_18592446127009213_7211520669110728348_n.jpg?stp=dst-jpg_e35_s1080x1080_tt6&_nc_cat=103&ig_cache_key=MzkxMTM4NzA3MTg2NDc2MTA4NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMzI2NC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=LRIxN_GUOooQ7kNvwEYiLpk&_nc_oc=AdqNmCcrdXtNOksEertKENEcKMdXcCmLNs1AW4W23LoP2f2MCTRMmt3rkMKRFQzYi64&_nc_ad=z-m&_nc_cid=1404&_nc_zt=23&_nc_ht=instagram.fcmn1-2.fna&_nc_gid=FTb4TL36XZLmkF3Na-UNWA&_nc_ss=7a22e&oh=00_Af_xITu03lzh0vS-HWkTx2ZgUcEq__pWAZv4_QHLeXCjMQ&oe=6A290B3E", likes: 334, commentsCount: 11, permalink: "https://www.instagram.com/drhuseyinbalikci/p/DZIOfVNDZa3/" },
  p3: { imageUrl: "https://instagram.fcmn1-2.fna.fbcdn.net/v/t51.82787-15/707992700_18590500765009213_1376145128668785571_n.jpg?stp=dst-jpg_e35_s1080x1080_tt6&_nc_cat=103&ig_cache_key=MzkwNzAzMzU3NzIxMTQwNTIzNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMzI2NC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=XRw6lk7V7N8Q7kNvwE_gzGr&_nc_oc=AdpRpYiLTwq2zZL_wRnjySUn0pqDWsG5HfK_5XVxAACbrTspIJmV3Qmt5v6aF6Yr4kE&_nc_ad=z-m&_nc_cid=1404&_nc_zt=23&_nc_ht=instagram.fcmn1-2.fna&_nc_gid=FTb4TL36XZLmkF3Na-UNWA&_nc_ss=7a22e&oh=00_Af9ug2qS2NZgIexVFP0JB83JqioiYZ3yRYOQpzPsHdgZ8w&oe=6A28EEC4", likes: 566, commentsCount: 38, permalink: "https://www.instagram.com/drhuseyinbalikci/p/DY4k8UQjX3w/" },
  p4: { imageUrl: "https://instagram.fcmn1-2.fna.fbcdn.net/v/t51.82787-15/659847834_18584266672009213_2210440109498685045_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=Mzg5MTcyMjMyMDkwNTg3NTYyMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=viObs7kzOT4Q7kNvwEcI7Z5&_nc_oc=Adq8nw3NGWRjGQQKYhS7W_fhM63vLI0AF-u1syKkAkzpz76kefaRC6Ah5JgONY7vxOs&_nc_ad=z-m&_nc_cid=1404&_nc_zt=23&_nc_ht=instagram.fcmn1-2.fna&_nc_gid=YY5oIBhFuSr_RiHcfmUIfQ&_nc_ss=7a22e&oh=00_Af9O-6JmTqA--DBk4E5SgllbagIPbrYNnFvmVHnGOAOn4g&oe=6A28F523", likes: 209, commentsCount: 10, permalink: "https://www.instagram.com/drhuseyinbalikci/p/DYCRP-4jf4A/" },
  p5: { imageUrl: "https://instagram.fcmn1-1.fna.fbcdn.net/v/t51.82787-15/688991211_18584143741009213_6410029730325402184_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzg5MTMxOTY0NTY0MzEzMjI0MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=f9eyU1Gy8iUQ7kNvwFExzil&_nc_oc=AdrKbrcyLOJ-Hf_aAG3uOY0zBFTJ5z7MZqQowRFcSFt4ow9lUFVGZ2cGcXCc4OfcDrA&_nc_ad=z-m&_nc_cid=1404&_nc_zt=23&_nc_ht=instagram.fcmn1-1.fna&_nc_gid=-Tax75k9_FRgvMPRsrzNvw&_nc_ss=7a22e&oh=00_Af-K0WdjxgnVEnvgdsOZIPkA64nheiw0PmsiHdAOXTZY9Q&oe=6A28F16A", likes: 253, commentsCount: 12, permalink: "https://www.instagram.com/drhuseyinbalikci/p/DYAvtaxjvL5/" },
  p6: { imageUrl: "https://instagram.fcmn1-4.fna.fbcdn.net/v/t51.82787-15/701598907_18587170891009213_4019489233435990593_n.jpg?stp=dst-jpg_e35_s1080x1080_tt6&_nc_cat=106&ig_cache_key=Mzg5OTA1NjYwMjE0ODUyNTc3Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMzI2NC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=uwS4c5nysqEQ7kNvwHyz6Vo&_nc_oc=AdrM69uTv09MS-mbhsJRlIyRHa3oRCm67LKceHyPJO3uTTQfHx5RdpIJOsLrir2vr9A&_nc_ad=z-m&_nc_cid=1404&_nc_zt=23&_nc_ht=instagram.fcmn1-4.fna&_nc_gid=YY5oIBhFuSr_RiHcfmUIfQ&_nc_ss=7a22e&oh=00_Af8Oz8BlsJhSblqvCy7t-_H4n5khjUHUpFPyOMgkPbHSgA&oe=6A292075", likes: 558, commentsCount: 11, permalink: "https://www.instagram.com/drhuseyinbalikci/p/DYcO7THDUFx/" }
};

const FEED_UI_TRANSLATIONS: Record<LanguageCode, {
  certified: string;
  rhinoplasty: string;
  bio: string;
  posts: string;
  followers: string;
  following: string;
  followBtn: string;
  badge: string;
  title: string;
  desc: string;
  hoverBadge: string;
  footerBtn: string;
  likes: string;
  comments: string;
  viewOriginal: string;
  closeBtn: string;
}> = {
  fr: {
    certified: "Certifié",
    rhinoplasty: "Rhinoplastie",
    bio: "Centre d'excellence d'esthétique et de rhinoplastie de pointe à Antalya. Précision chirurgicale et résultats naturels d'exception.",
    posts: "Posts",
    followers: "Abonnés",
    following: "Suivis",
    followBtn: "Suivre",
    badge: "Flux Instagram Connecté",
    title: "Découvrez nos Transformations",
    desc: "Explorez les résultats chirurgicaux du Dr. Hüseyin Balıkçı et le quotidien de notre clinique d'excellence à Antalya.",
    hoverBadge: "Profil",
    footerBtn: "Voir tous les posts sur @drhuseyinbalikci",
    likes: "J'aime",
    comments: "Commentaires",
    viewOriginal: "Voir l'original sur Instagram",
    closeBtn: "Fermer"
  },
  en: {
    certified: "Certified",
    rhinoplasty: "Rhinoplasty",
    bio: "Center of excellence for state-of-the-art aesthetics and rhinoplasty in Antalya. Exceptional surgical precision and natural outcomes.",
    posts: "Posts",
    followers: "Followers",
    following: "Following",
    followBtn: "Follow",
    badge: "Connected Instagram Feed",
    title: "Discover our Transformations",
    desc: "Explore the surgical results of Dr. Hüseyin Balıkçı and the daily life of our premier clinic in Antalya.",
    hoverBadge: "Profile",
    footerBtn: "View all posts on @drhuseyinbalikci",
    likes: "Likes",
    comments: "Comments",
    viewOriginal: "View original on Instagram",
    closeBtn: "Close"
  },
  es: {
    certified: "Certificado",
    rhinoplasty: "Rinoplastia",
    bio: "Centro de excelencia en estética y rinoplastia avanzada en Antalya. Cirugía de precisión y resultados excepcionales naturales.",
    posts: "Publicaciones",
    followers: "Seguidores",
    following: "Seguidos",
    followBtn: "Seguir",
    badge: "Feed de Instagram Conectado",
    title: "Descubra nuestras Transformaciones",
    desc: "Explore los resultados quirúrgicos del Dr. Hüseyin Balıkçı y la vida cotidiana de nuestra clínica de excelencia en Antalya.",
    hoverBadge: "Perfil",
    footerBtn: "Ver todas las publicaciones en @drhuseyinbalikci",
    likes: "Me gusta",
    comments: "Comentarios",
    viewOriginal: "Ver original en Instagram",
    closeBtn: "Cerrar"
  },
  ru: {
    certified: "Сертифицирован",
    rhinoplasty: "Ринопластика",
    bio: "Центр передовой эстетики и ринопластики в Анталье. Исключительная хирургическая точность и естественный результат.",
    posts: "Посты",
    followers: "Подписчики",
    following: "Подписки",
    followBtn: "Подписаться",
    badge: "Инстаграм-лента подключена",
    title: "Наши преображения",
    desc: "Посмотрите результаты работы доктора Хюсейна Балыкчи и будни нашей первоклассной клиники в Анталье.",
    hoverBadge: "Профиль",
    footerBtn: "Посмотреть все посты на @drhuseyinbalikci",
    likes: "Нравится",
    comments: "Комментарии",
    viewOriginal: "Оригинал в Instagram",
    closeBtn: "Закрыть"
  },
  pl: {
    certified: "Certyfikowany",
    rhinoplasty: "Korekcja Nosa",
    bio: "Centrum doskonałości estetyki i zaawansowanej rynoplastyki w Antalyi. Chirurgiczna precyzja i naturalne rezultaty.",
    posts: "Posty",
    followers: "Obserwujący",
    following: "Obserwowani",
    followBtn: "Obserwuj",
    badge: "Połączony Instagram",
    title: "Zobacz nasze Transformacje",
    desc: "Więcej efektów u pacjentów dr. Hüseyina Balıkçı oraz codzienne relacje z naszej kliniki w Antalyi.",
    hoverBadge: "Profil",
    footerBtn: "Zobacz wszystkie posty na @drhuseyinbalikci",
    likes: "Polubienia",
    comments: "Komentarze",
    viewOriginal: "Zobacz oryginalny post na Instagramie",
    closeBtn: "Zamknij"
  },
  de: {
    certified: "Zertifiziert",
    rhinoplasty: "Rhinoplastik",
    bio: "Exzellenzzentrum für moderne Ästhetik und Nasenkorrekturen in Antalya. Chirurgische Präzision und außergewöhnliche natürliche Ergebnisse.",
    posts: "Beiträge",
    followers: "Follower",
    following: "Gefolgt",
    followBtn: "Folgen",
    badge: "Verbundener Instagram-Feed",
    title: "Entdecken Sie unsere Verwandlungen",
    desc: "Erleben Sie die Operationsergebnisse von Dr. Hüseyin Balıkçı und den Alltag unserer Spitzenklinik in Antalya.",
    hoverBadge: "Profil",
    footerBtn: "Beiträge auf @drhuseyinbalikci ansehen",
    likes: "Gefällt mir",
    comments: "Kommentare",
    viewOriginal: "Original auf Instagram ansehen",
    closeBtn: "Schließen"
  },
  ja: {
    certified: "公式認定",
    rhinoplasty: "鼻整形・他院修正",
    bio: "アンタルヤに位置する最先端フェイスエステティック＆鼻整形専門センター。卓越した技量と自然美を追求します。",
    posts: "投稿",
    followers: "フォロワー",
    following: "フォロー中",
    followBtn: "フォローする",
    badge: "公式Instagramシステム連携済",
    title: "劇的なビフォーアフター",
    desc: "ヒュセイン・バルクチュ医師が手がけた最高難易度の症例結果と、アンタルヤ一流クリニックの日常をご覧ください。",
    hoverBadge: "プロフィール",
    footerBtn: "Instagramで全投稿を見る @drhuseyinbalikci",
    likes: "いいね！",
    comments: "件のコメント",
    viewOriginal: "Instagramで実物を見る",
    closeBtn: "閉じる"
  },
  ko: {
    certified: "공식 인증",
    rhinoplasty: "코 성형 전문",
    bio: "안탈리아에 위치한 세계적 수준의 정밀 코 성형 에스테틱 센터. 정밀한 해부외과적 분석과 신뢰의 결과를 드립니다.",
    posts: "게시물",
    followers: "팔로워",
    following: "팔로잉",
    followBtn: "팔로우",
    badge: "실시간 연동 인스타그램 피드",
    title: "정교한 페이스 성형 전후",
    desc: "후세인 발륵츠 박사의 놀라운 수술 집도 전후 사례들과 고품격 안탈리아 클리닉의 리얼한 소통 일상을 확인하세요.",
    hoverBadge: "프로필",
    footerBtn: "인스타그램 전체 사례 보기 @drhuseyinbalikci",
    likes: "좋아요",
    comments: "댓글",
    viewOriginal: "원래 인스타그램 포스트 보기",
    closeBtn: "닫기"
  },
  ar: {
    certified: "موثق",
    rhinoplasty: "تجميل الأنف",
    bio: "مركز التميز والريادة لعمليات تجميل وزخرفة الأنف الحديثة في أنطاليا. دقة جراحية بالغة الجودة ونتائج طبيعية مذهلة.",
    posts: "منشورات",
    followers: "متابعون",
    following: "يتابع",
    followBtn: "متابعة",
    badge: "خلاصة الإنستغرام الرسمية",
    title: "اكتشفوا قصص نجاحنا",
    desc: "تصفحوا النتائج الجراحية الحصرية للدكتور حسين بالكتشي وقصص التشافي اليومية في عيادتنا المرموقة بأنطاليا.",
    hoverBadge: "الملف الشخصي",
    footerBtn: "عرض كل المنشورات على @drhuseyinbalikci",
    likes: "إعجابات",
    comments: "تعليقات",
    viewOriginal: "عرض المنشور الأصلي على إنستغرام",
    closeBtn: "إغلاق"
  }
};

export default function InstagramFeed({ lang }: InstagramFeedProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  const ui = FEED_UI_TRANSLATIONS[lang] || FEED_UI_TRANSLATIONS['en'];

  // Map simulated posts to currently selected language
  const localizedPosts: InstagramPost[] = Object.keys(POST_CAPTIONS).map(id => {
    const translation = POST_CAPTIONS[id][lang] || POST_CAPTIONS[id]['en'];
    const metadata = MOCK_METADATA[id as keyof typeof MOCK_METADATA];
    return {
      id,
      imageUrl: metadata.imageUrl,
      likes: metadata.likes,
      commentsCount: metadata.commentsCount,
      permalink: metadata.permalink,
      caption: translation.caption,
      date: translation.date
    };
  });

  return (
    <section id="instagram-feed" className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Clinician Branding & Stats Summary */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-white rounded-2xl p-6 md:p-8 border border-slate-100 glow-card">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shrink-0">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  <img 
                    src={doctorProfile} 
                    alt="Dr. Hüseyin Balıkçı Instagram Avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-xl text-slate-900">Opera Yaşam</h3>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {ui.certified}
                </span>
                <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {ui.rhinoplasty}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">@drhuseyinbalikci</p>
              <p className="text-slate-600 text-sm mt-2 max-w-md">
                {ui.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-10 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 w-full md:w-auto justify-around">
            <div className="text-center">
              <span className="block font-display font-bold text-lg md:text-xl text-slate-900">2,056</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{ui.posts}</span>
            </div>
            <div className="text-center">
              <span className="block font-display font-bold text-lg md:text-xl text-slate-900">323K</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{ui.followers}</span>
            </div>
            <div className="text-center">
              <span className="block font-display font-bold text-lg md:text-xl text-slate-900">2,708</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-sans">{ui.following}</span>
            </div>
            <a 
              href="https://www.instagram.com/drhuseyinbalikci/" 
              target="_blank" 
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs md:text-sm px-4 py-2.5 rounded-lg font-medium inline-flex items-center gap-1.5 transition-all self-center whitespace-nowrap"
              rel="noopener noreferrer"
            >
              {ui.followBtn} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-1.5 bg-teal-50 text-teal-800 font-semibold text-xs px-2.5 py-1 rounded-full mb-3">
            <Camera className="w-3.5 h-3.5 text-teal-500" /> {ui.badge}
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900">{ui.title}</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            {ui.desc}
          </p>
        </div>

        {/* Responsive Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {localizedPosts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-900 group shadow-md hover:shadow-xl transition-all"
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              
              {/* Overlay on hover */}
              <div 
                className={`absolute inset-0 bg-slate-950/70 transition-opacity duration-300 flex flex-col justify-between p-5 ${
                  hoveredId === post.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex justify-end">
                  <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm self-start inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> {ui.hoverBadge}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-white text-sm line-clamp-3 font-light leading-relaxed">
                    {post.caption}
                  </p>
                  
                  <div className="flex items-center justify-between text-white border-t border-white/15 pt-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm font-semibold text-rose-400">
                        <Heart className="w-4 h-4 fill-current" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-teal-300">
                        <MessageCircle className="w-4 h-4" /> {post.commentsCount}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/50">{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View on Instagram Footer */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/drhuseyinbalikci/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-6 py-3 rounded-xl transition-all"
          >
            {ui.footerBtn} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            <button 
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center text-lg cursor-pointer"
              onClick={() => setSelectedPost(null)}
            >
              &times;
            </button>
            
            {/* Visual Part */}
            <div className="md:w-1/2 aspect-square bg-slate-900 flex items-center">
              <img 
                src={selectedPost.imageUrl} 
                alt="Enlarged Post" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Context Part */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                    <img 
                      src={doctorProfile} 
                      alt="Dr. Hüseyin Balıkçı" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold font-display text-sm text-slate-900">Opera Yaşam</h4>
                    <p className="text-xs text-slate-400">@drhuseyinbalikci</p>
                  </div>
                </div>
                
                <p className="text-slate-600 text-xs sm:text-sm mt-4 leading-relaxed whitespace-pre-line overflow-y-auto max-h-[160px] pr-2">
                  {selectedPost.caption}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-6 mb-4 text-slate-700">
                  <span className="flex items-center gap-1 text-sm font-medium text-slate-800">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> {selectedPost.likes} {ui.likes}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-slate-800">
                    <MessageCircle className="w-5 h-5 text-teal-600" /> {selectedPost.commentsCount} {ui.comments}
                  </span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={selectedPost.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-center py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    {ui.viewOriginal} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-lg transition-all cursor-pointer"
                  >
                    {ui.closeBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
