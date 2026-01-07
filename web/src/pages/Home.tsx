import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadSimple, Link } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "../assets/logo.svg";
import Button from "../components/Button";
import { IconButton } from "../components/IconButton";
import Input from "../components/Input";

const createLinkSchema = z.object({
  originalUrl: z.url("Invalid URL format"),
});

type CreateLinkData = z.infer<typeof createLinkSchema>;

export const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  const handleCreateLink = (data: CreateLinkData) => {
    //TODO: implement api call
    console.log(data);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans text-gray-600 p-6 md:p-12">
      <header className="mb-10 max-w-6xl mx-auto flex items-center gap-2">
        <img src={logo} alt="brev.ly" className="h-10 w-auto object-contain" />
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        <section className="bg-white rounded-lg p-8 shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-bold text-gray-600">New link</h2>
          <form className="space-y-6" onSubmit={handleSubmit(handleCreateLink)}>
            <Input label="Original link" placeholder="www.exemple.com.br" error={errors.originalUrl?.message} {...register("originalUrl")} />
            <Button type="submit" isLoading={isSubmitting}>
              Shorten link
            </Button>
          </form>
        </section>

        <section className="bg-white rounded-lg p-8 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-600">My links</h2>
            <IconButton icon={DownloadSimple} label="Download CSV" disabled />
          </div>
          <div className="w-full h-px bg-gray-200 mb-12" />
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-gray-500">
            <Link size={48} weight="regular" />
            <span className="text-xs uppercase tracking-wide">There are no links registered yet.</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
