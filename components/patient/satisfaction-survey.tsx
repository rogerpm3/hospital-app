'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Heart,
  Users,
  Building2,
  Utensils,
  Clock,
  ThumbsUp
} from 'lucide-react';

interface SurveyQuestion {
  id: string;
  category: string;
  question: string;
  icon: React.ReactNode;
}

const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'medical_care',
    category: 'Atención Médica',
    question: '¿Cómo calificaría la atención médica recibida?',
    icon: <Heart className="h-5 w-5 text-red-500" />
  },
  {
    id: 'nursing_care',
    category: 'Atención de Enfermería',
    question: '¿Cómo calificaría el trato del personal de enfermería?',
    icon: <Users className="h-5 w-5 text-blue-500" />
  },
  {
    id: 'facilities',
    category: 'Instalaciones',
    question: '¿Cómo calificaría las instalaciones y la habitación?',
    icon: <Building2 className="h-5 w-5 text-green-500" />
  },
  {
    id: 'food',
    category: 'Alimentación',
    question: '¿Cómo calificaría la calidad de la comida?',
    icon: <Utensils className="h-5 w-5 text-orange-500" />
  },
  {
    id: 'wait_times',
    category: 'Tiempos de Espera',
    question: '¿Cómo calificaría los tiempos de espera para ser atendido?',
    icon: <Clock className="h-5 w-5 text-purple-500" />
  },
  {
    id: 'overall',
    category: 'Satisfacción General',
    question: '¿Cuál es su nivel de satisfacción general con el hospital?',
    icon: <ThumbsUp className="h-5 w-5 text-cyan-500" />
  }
];

export default function SatisfactionSurvey() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (questionId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = async () => {
    // Verificar que todas las preguntas tengan respuesta
    const unanswered = surveyQuestions.filter(q => !ratings[q.id]);
    if (unanswered.length > 0) {
      toast({
        title: "Encuesta incompleta",
        description: "Por favor, responde todas las preguntas antes de enviar",
        variant: "destructive",
      });
      return;
    }

    if (recommendation === null) {
      toast({
        title: "Encuesta incompleta",
        description: "Por favor, indica si recomendarías el hospital",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    toast({
      title: "¡Gracias por tu opinión!",
      description: "Tu encuesta ha sido enviada correctamente",
    });
  };

  const StarRating = ({ questionId, currentRating }: { questionId: string; currentRating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRating(questionId, star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Vista de encuesta completada
  if (submitted) {
    return (
      <div className="p-6 space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Gracias por completar la encuesta!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu opinión es muy valiosa para nosotros y nos ayuda a mejorar 
              la calidad de nuestros servicios.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Resumen de tu valoración:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {surveyQuestions.map(q => (
                  <div key={q.id} className="flex items-center justify-between">
                    <span className="text-gray-600">{q.category}:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (ratings[q.id] || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              className="mt-6" 
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setRatings({});
                setComments('');
                setRecommendation(null);
              }}
            >
              Realizar otra encuesta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Encuesta de Satisfacción</h1>
          <p className="text-gray-600">
            Tu opinión nos ayuda a mejorar. Por favor, valora tu experiencia en el hospital.
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-300">
          <MessageSquare className="h-4 w-4 mr-1" />
          Anónima
        </Badge>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">
                Hola {user?.firstName}, queremos conocer tu opinión
              </p>
              <p className="text-sm text-blue-700">
                Tus respuestas son confidenciales y nos ayudan a mejorar la atención hospitalaria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preguntas de la encuesta */}
      <div className="space-y-4">
        {surveyQuestions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {question.icon}
                <span className="text-gray-500 text-sm font-normal">
                  Pregunta {index + 1} de {surveyQuestions.length}
                </span>
              </CardTitle>
              <CardDescription className="text-gray-900 font-medium text-base">
                {question.question}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Muy malo</span>
                <StarRating 
                  questionId={question.id} 
                  currentRating={ratings[question.id] || 0} 
                />
                <span className="text-sm text-gray-500">Excelente</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pregunta de recomendación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            ¿Recomendarías este hospital a familiares o amigos?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={recommendation === 1 ? "default" : "outline"}
              className={`flex-1 ${recommendation === 1 ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={() => setRecommendation(1)}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Sí, lo recomendaría
            </Button>
            <Button
              type="button"
              variant={recommendation === 0 ? "default" : "outline"}
              className={`flex-1 ${recommendation === 0 ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
              onClick={() => setRecommendation(0)}
            >
              Tal vez
            </Button>
            <Button
              type="button"
              variant={recommendation === -1 ? "default" : "outline"}
              className={`flex-1 ${recommendation === -1 ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={() => setRecommendation(-1)}
            >
              No lo recomendaría
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comentarios adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comentarios adicionales (opcional)</CardTitle>
          <CardDescription>
            ¿Hay algo más que quieras compartir sobre tu experiencia?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Escribe tus comentarios, sugerencias o cualquier aspecto que quieras destacar..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Botón de envío */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          size="lg"
          className="px-8"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Encuesta
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

