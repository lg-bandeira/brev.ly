import Error from "../assets/error.svg";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-sm w-full max-w-lg p-12 md:p-16 flex flex-col items-center text-center">
        <div className="mb-4">
          <img src={Error} alt="brev.ly" className="h-18 w-auto object-contain" />
        </div>
        <h1 className="text-xl font-bold text-gray-600 mb-4">Link not found</h1>
        <p className="text-md font-semibold text-gray-500 mb-2">
          The link you are trying to access does not exist, has been removed, or is an invalid URL. Learn more at{" "}
          <a href="/" className="text-blue-base hover:underline hover:text-blue-dark transition-colors">
            brev.ly
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
