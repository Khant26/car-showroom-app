import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { RiLineFill } from 'react-icons/ri';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { translate } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert(translate('contact.form.success'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: translate('contact.info.phone'),
      details: '0943318891 / 0909833149',
      link: 'tel:0943318891'
    },
    {
      icon: RiLineFill,
      title: translate('contact.info.line'),
      details: 'successdiamond30@gmail.com',
      link: 'mailto:successdiamond30@gmail.com'//Change The Line Account here
    },
    {
      icon: FaMapMarkerAlt,
      title: translate('contact.info.address'),
      details: '599/1-599/11, On Nut Rd, Prawet, Bangkok 10250',
      link: 'https://maps.app.goo.gl/3AifPCLFQG5QgfTD6'
    },
    {
      icon: FaClock,
      title: translate('contact.info.hours'),
      details: 'Mon-Sat: 9AM-6PM, Sun: 10AM-4PM',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-red-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gold-500">{translate('contact.title')}</h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto text-gold-300">
            {translate('contact.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Contact Us and Map - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Why Contact Us */}
          <div className="bg-black border border-red-800 p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gold-500 mb-4">{translate('contact.why.title')}</h3>
              <p className="text-lg text-gold-300">
                {translate('contact.why.subtitle')}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🚗</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gold-400 mb-2">{translate('contact.why.expert.title')}</h4>
                  <p className="text-gold-300">{translate('contact.why.expert.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-red-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gold-400 mb-2">{translate('contact.why.financing.title')}</h4>
                  <p className="text-gold-300">{translate('contact.why.financing.desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-red-900 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔧</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gold-400 mb-2">{translate('contact.why.service.title')}</h4>
                  <p className="text-gold-300">{translate('contact.why.service.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-black border border-red-800 p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gold-500 mb-4">{translate('contact.visit.title')}</h3>
            <div className="aspect-w-16 aspect-h-9 mb-4 border border-red-700 rounded-lg p-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8944447555845!2d100.6097!3d13.6896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQxJzIyLjYiTiAxMDDCsDM2JzM1LjAiRQ!5e0!3m2!1sen!2sth!4v1696165200000!5m2!1sen!2sth"
                width="100%"
                height="256"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                title="CarShowroom Location"
              ></iframe>
            </div>
            <p className="text-gold-300 mb-4">
              {translate('contact.visit.desc')}
            </p>
            <div className="text-sm text-gold-300">
              <p>📍 599/1-599/11, On Nut Rd, Prawet, Bangkok 10250, Thailand</p>
              <p>📞 0943318891 / 0909833149</p>
              <p>📧 successdiamond30@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form - Full Width Second Row */}
        <div className="bg-black border border-red-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gold-500 mb-6 text-center">{translate('contact.form.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gold-400 mb-2">
                    {translate('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder-gold-600"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gold-400 mb-2">
                    {translate('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder-gold-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gold-400 mb-2">
                    {translate('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder-gold-600"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gold-400 mb-2">
                    {translate('contact.form.subject')} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="">{translate('contact.form.subject.select')}</option>
                    <option value="general">{translate('contact.form.subject.general')}</option>
                    <option value="sales">{translate('contact.form.subject.sales')}</option>
                    <option value="rental">{translate('contact.form.subject.rental')}</option>
                    <option value="service">{translate('contact.form.subject.service')}</option>
                    <option value="feedback">{translate('contact.form.subject.feedback')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gold-400 mb-2">
                  {translate('contact.form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-black border border-red-800 text-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 placeholder-gold-600"
                  placeholder={translate('contact.form.message.placeholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-gold-200 py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                {translate('contact.form.submit')}
              </button>
            </form>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const content = (
              <div className="bg-black border border-red-800 p-6 rounded-lg shadow-md text-center hover:border-gold-500 transition-all duration-300 h-48 flex flex-col justify-between">
                <div>
                  <div className="flex justify-center mb-4">
                    <Icon className="text-3xl text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gold-400 mb-2">
                    {info.title}
                  </h3>
                </div>
                <p className="text-gold-300 text-sm">{info.details}</p>
              </div>
            );

            return info.link ? (
              <a key={index} href={info.link} className="block">
                {content}
              </a>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Contact;