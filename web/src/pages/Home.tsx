import { zodResolver } from "@hookform/resolvers/zod";
import { CopySimple, DownloadSimple, Link, Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import Logo from "../assets/logo.svg";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import { createLink, deleteLink, exportCsv, getShortLinkUrl, listLinks, type LinkItem } from "../lib/api";

const createLinkSchema = z.object({
  originalUrl: z.url("Invalid URL format"),
});

type CreateLinkData = z.infer<typeof createLinkSchema>;

export const Home = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  const fetchLinks = async () => {
    try {
      setIsLoadingLinks(true);
      const data = await listLinks();
      setLinks(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load links list.");
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const handleCreateLink = async (linkData: CreateLinkData) => {
    try {
      await createLink(linkData.originalUrl);
      await fetchLinks();
      reset();
      toast.success("Link shortened successfully!");
    } catch (error) {
      console.error("Error while trying to create link.", error);
      toast.error("Failed to create link. Please try again.");
    }
  };

  const handleDeleteLink = async (shortCode: string) => {
    try {
      await deleteLink(shortCode);
      await fetchLinks();
      toast.success("Link deleted successfully.");
    } catch (error) {
      console.error("Error while trying to delete link.", error);
      toast.error("Failed to delete link.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const { downloadUrl } = await exportCsv();
      window.location.href = downloadUrl;
      toast.success("CSV download started!");
    } catch (error) {
      console.error("Error while trying to export CSV.", error);
      toast.error("Failed to export CSV.");
    }
  };

  const handleCopyLink = (shortCode: string) => {
    const url = getShortLinkUrl(shortCode);
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 text-gray-600 p-6 md:p-12">
      <Toaster position="top-right" richColors />

      <header className="mb-10 max-w-6xl mx-auto flex items-center gap-2">
        <img src={Logo} alt="brev.ly" className="h-10 w-auto object-contain" />
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
            <IconButton icon={DownloadSimple} label="Download CSV" disabled={!links.length} onClick={() => handleExportCSV()} />
          </div>
          <div className="w-full h-px bg-gray-200" />
          {isLoadingLinks ? (
            <div className="flex flex-col gap-4 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 px-2 animate-pulse">
                  <div className="flex flex-col gap-2 w-full max-w-[60%]">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center gap-6 pl-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : links.length > 0 ? (
            <div className="flex flex-col overflow-y-auto max-h-[600px]">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between py-6 border-b border-gray-200 last:border-b-0 px-2">
                  <div className="flex flex-col gap-1 min-w-0 max-w-[60%]">
                    <a href={getShortLinkUrl(link.shortCode)} target="_blank" rel="noreferrer" className="text-blue-base font-semibold hover:underline truncate">
                      brev.ly/{link.shortCode}
                    </a>
                    <span className="text-sm text-gray-500 truncate">{link.originalUrl}</span>
                  </div>

                  <div className="flex items-center gap-6 pl-4">
                    <span className="text-gray-500 text-sm whitespace-nowrap">{link.views > 1 ? `${link.views} views` : `${link.views} view`}</span>

                    <div className="flex items-center gap-2">
                      <IconButton icon={CopySimple} title="Copy link" onClick={() => handleCopyLink(link.shortCode)} />
                      <IconButton icon={Trash} title="Delete link" onClick={() => handleDeleteLink(link.shortCode)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 text-gray-500">
              <Link size={48} weight="regular" />
              <span className="text-xs uppercase tracking-wide">There are no links registered yet.</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
