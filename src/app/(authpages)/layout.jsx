import AuthLayout from '../components/AuthLayout';

export const metadata = {
  title: 'Auth - MyApp',
  description: 'Authentication pages',
};

export default function AuthPageLayout({ children }) {
  return <AuthLayout>{children}</AuthLayout>;
}
