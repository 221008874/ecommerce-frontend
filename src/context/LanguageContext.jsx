// src/context/LanguageContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

// Translations
const translations = {
  ar: {
    appName: 'شوب إيزي',
    Louable: 'لوابل',
    featuredProducts: 'المنتجات المميزة',
    addToCart: 'أضف إلى السلة',
    cart: 'السلة',
    total: 'الإجمالي',
    checkout: 'إتمام الشراء',
    continueShopping: 'متابعة التسوق',
    emptyCart: 'سلة التسوق فارغة',
    addProducts: 'أضف بعض المنتجات إلى سلة التسوق!',
    price: 'السعر',
    quantity: 'الكمية',
    remove: 'إزالة',
    theme: 'الوضع',
    lightMode: 'وضع النهار',
    darkMode: 'وضع الليل',
    viewDetails: 'عرض التفاصيل',
    piecesPerBox: 'عدد القطع في العلبة',
    flavors: 'النكهات',
    description: 'الوصف',
    backToProducts: 'العودة إلى المنتجات',
    goToCart: 'الذهاب إلى السلة',
    // Footer translations
    footerTagline: 'صناعة الشوكولاتة الفاخرة بشغف وتميز. كل قطعة تحكي قصة من الجودة والمذاق الرائع.',
    quickLinks: 'روابط سريعة',
    home: 'الرئيسية',
    products: 'المنتجات',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    contactUs: 'تواصل معنا',
    followUs: 'تابعنا',
    allRightsReserved: 'جميع الحقوق محفوظة',
    handcraftedWith: 'صنع بحب',
    aboutUs: 'من نحن',
    aboutUsTitle: 'من نحن',
    ourMission: 'مهمتنا',
    missionDescription: 'في لوابل، نحن ملتزمون بتقديم أفضل أنواع الشوكولاتة الفاخرة المصنوعة يدويًا من أجود مكونات الكاكاو. نجمع بين التقاليد القديمة والابتكار الحديث لخلق تجارب لا تُنسى.',
    ourVision: 'رؤيتنا',
    visionDescription: 'أن نكون العلامة التجارية الرائدة للشوكولاتة الفاخرة في الشرق الأوسط، مع الحفاظ على أعلى معايير الجودة والاستدامة.',
    ourValues: 'قيمنا',
    valuesDescription: 'الجودة، الأصالة، الابتكار، والاستدامة هي قيمنا الأساسية التي نبني عليها كل ما نقوم به.',
    backToHome: 'العودة إلى الرئيسية',
     privacyPolicy: 'سياسة الخصوصية',
  lastUpdated: 'آخر تحديث',
  informationWeCollect: 'المعلومات التي نجمعها',
  infoCollectionText: 'نقوم بجمع معلوماتك عند استخدامك لتطبيقنا، مثل اسم المنتجات المضافة إلى سلة التسوق وتفاصيل الطلب. لا نقوم بجمع أي معلومات شخصية حساسة.',
  howWeUseInfo: 'كيف نستخدم معلوماتك',
  useInfoText: 'نستخدم المعلومات التي نجمعها لتحسين تجربتك في الشراء، وعرض المنتجات ذات الصلة، وتقديم دعم فني.',
  dataSharing: 'مشاركة البيانات',
  dataSharingText: 'نحن لا نشارك بياناتك مع أي أطراف ثالثة. جميع المعلومات تُخزن بشكل آمن في قواعد بيانات Firebase الخاصة بنا.',
  dataSecurity: 'أمن البيانات',
  securityText: 'نستخدم أفضل ممارسات الأمان لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو التدمير.',
  yourRights: 'حقوقك',
  rightsText: 'لديك الحق في طلب حذف بياناتك أو تصحيحها في أي وقت عن طريق التواصل معنا.',
  contactUs: 'اتصل بنا',
  contactPrivacyText: 'لأي استفسارات حول سياسة الخصوصية، يرجى مراسلتنا على: louablefactory@gmail.com',
  backToHome: 'العودة إلى الرئيسية'
  },
  en: {
    appName: 'ShopEasy',
    Louable: 'Louable',
    featuredProducts: 'Featured Products',
    addToCart: 'Add to Cart',
    cart: 'Cart',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    emptyCart: 'Your cart is empty',
    addProducts: 'Add some products to your cart!',
    price: 'Price',
    quantity: 'Quantity',
    remove: 'Remove',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    viewDetails: 'View Details',
    piecesPerBox: 'Pieces per Box',
    flavors: 'Flavors',
    description: 'Description',
    backToProducts: 'Back to Products',
    goToCart: 'Go to Cart',
    // Footer translations
    footerTagline: 'Crafting premium chocolates with passion and excellence. Every piece tells a story of quality and taste.',
    quickLinks: 'Quick Links',
    home: 'Home',
    products: 'Products',
    aboutUs: 'About Us',
    contact: 'Contact',
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved',
    handcraftedWith: 'Handcrafted with',
    aboutUs: 'About Us',
    aboutUsTitle: 'About Us',
    ourMission: 'Our Mission',
    missionDescription: 'At Louable, we are committed to crafting premium artisanal chocolates using the finest cocoa ingredients. We blend time-honored traditions with modern innovation to create unforgettable experiences.',
    ourVision: 'Our Vision',
    visionDescription: 'To become the leading luxury chocolate brand in the Middle East, while maintaining the highest standards of quality and sustainability.',
    ourValues: 'Our Values',
    valuesDescription: 'Quality, authenticity, innovation, and sustainability are our core values that guide everything we do.',
    backToHome: 'Back to Home',
      privacyPolicy: 'Privacy Policy',
  lastUpdated: 'Last Updated',
  informationWeCollect: 'Information We Collect',
  infoCollectionText: 'We collect information when you use our app, such as products added to your cart and order details. We do not collect any sensitive personal information.',
  howWeUseInfo: 'How We Use Your Information',
  useInfoText: 'We use the collected information to improve your shopping experience, show relevant products, and provide technical support.',
  dataSharing: 'Data Sharing',
  dataSharingText: 'We do not share your data with any third parties. All information is securely stored in our Firebase databases.',
  dataSecurity: 'Data Security',
  securityText: 'We follow industry best practices to protect your data from unauthorized access, alteration, disclosure, or destruction.',
  yourRights: 'Your Rights',
  rightsText: 'You have the right to request deletion or correction of your data at any time by contacting us.',
  contactUs: 'Contact Us',
  contactPrivacyText: 'For any questions about this Privacy Policy, please email us at: louablefactory@gmail.com',
  backToHome: 'Back to Home'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en') // Default: English

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem('language')
    if (saved === 'ar' || saved === 'en') {
      setLang(saved)
    }
  }, [])

  // Apply direction & language to body
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('language', lang)
  }, [lang])

  const t = (key) => translations[lang][key] || key

  const toggleLanguage = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar')
  }

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)