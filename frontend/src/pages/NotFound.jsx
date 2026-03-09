import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-bold text-primary/20">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-text-main">Page not found</h2>
      <p className="mt-2 text-text-body max-w-md">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
