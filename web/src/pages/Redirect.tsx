import LogoIcon from "../assets/logo-icon.svg";

interface RedirectPageProps {
  destinationUrl?: string;
}

export const Redirect = ({ destinationUrl }: RedirectPageProps) => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-sm w-full max-w-lg p-12 md:p-16 flex flex-col items-center text-center">
        <div className="mb-4 animate-pulse">
          <img src={LogoIcon} alt="brev.ly" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="text-xl font-bold text-gray-600 mb-4">Redirecting...</h1>
        <p className="text-md font-semibold text-gray-500 mb-2">The link will open automatically in a few moments.</p>
        <p className="text-md font-semibold text-gray-500">
          Haven't been redirected yet?{" "}
          <a href={destinationUrl} className="text-blue-base hover:underline hover:text-blue-dark transition-colors">
            Click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Redirect;
