import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Connexion - CineVerse',
  description: 'Connectez-vous pour gérer votre collection de films',
};

export default function LoginPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Administration CineVerse</h1>
        <p className="text-gray-600">
          Connectez-vous pour gérer votre collection de films
        </p>
      </div>
      
      <LoginForm />
    </div>
  );
}
