import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Heart, BarChart3, Sparkles, MessageCircle, Wind, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Track your emotions daily with detailed notes and insights'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Visualize your emotional patterns and progress over time'
    },
    {
      icon: Sparkles,
      title: 'Calming Games',
      description: 'Interactive breathing exercises, puzzles, and meditation timers'
    },
    {
      icon: MessageCircle,
      title: 'AI Support Chat',
      description: 'Get 24/7 emotional support from our AI wellness assistant'
    },
    {
      icon: Wind,
      title: 'Mindfulness Corner',
      description: 'Guided meditation and mindfulness exercises for inner peace'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-blue-500 mb-8 animate-pulse">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your Mental Wellness
              </span>
              <br />
              <span className="text-slate-800">Journey Starts Here</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Take control of your emotional well-being with AI-powered insights, 
              mood tracking, and personalized mindfulness practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="px-8 py-6 text-lg rounded-xl border-2 border-slate-300 hover:border-teal-400 hover:bg-white transition-all duration-300"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Everything You Need for Mental Wellness
          </h2>
          <p className="text-lg text-slate-600">
            Comprehensive tools designed to support your emotional health
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Why Choose MindWell?
              </h2>
              <div className="space-y-4">
                {[
                  'Science-backed mood tracking methods',
                  'AI-powered emotional support available 24/7',
                  'Privacy-focused with local data storage',
                  'Beautiful, calming interface designed for peace',
                  'Progress tracking with detailed analytics'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl p-8 shadow-xl">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600">Your Progress</span>
                    <span className="text-2xl font-bold text-teal-600">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-3 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="text-3xl font-bold text-blue-600 mb-1">28</div>
                    <div className="text-sm text-slate-600">Days Active</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="text-3xl font-bold text-teal-600 mb-1">142</div>
                    <div className="text-sm text-slate-600">Mood Entries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-teal-500 to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Mental Wellness?
            </h2>
            <p className="text-xl mb-8 text-teal-50">
              Join thousands of users who have improved their emotional well-being
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Landing;