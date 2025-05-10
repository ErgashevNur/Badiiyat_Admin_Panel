import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  AudioLinesIcon,
  Book,
  Plus,
  Loader2,
  PencilLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getAccessToken } from "../utils/auth";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatNumber(num) {
    if (!num) return "0";
    return num.toLocaleString("ru-RU").replace(/,/g, " ");
  }

  // https://library-1dmu.onrender.com/update_book/${id}

  useEffect(() => {
    fetch(`https://library-1dmu.onrender.com/get_one_book/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API xatosi:", error);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      toast.error("Access token olinmadi — qayta login qiling");
      return;
    }

    try {
      const response = await fetch(
        `https://library-1dmu.onrender.com/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("O‘chirishda xatolik");
      }

      toast.success("Kitob o‘chirildi");
      navigate("/books");
    } catch (error) {
      console.error("Delete xatolik:", error);
      toast.error("O‘chirishda xatolik");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center">
        <Button className="mx-auto flex items-center" disabled>
          <Loader2 className="animate-spin" />
          Ma'lumotlar yuklanmoqda...
        </Button>
      </div>
    );

  return (
    <section
      className="h-[100vh] flex justify-between text-white bg-[length:1000px_900px] bg-[position:600px_180px] bg-no-repeat"
      style={{ backgroundImage: "url('/bg.svg')" }}
    >
      <div className="mx-[81px] mt-10 flex gap-10 text-white">
        {/* <img
          src={book?.img || ".../public/image 18.png"}
          alt={book?.title}
          className="h-[500px] w-[350px] rounded-xl object-cover shadow-md"
        /> */}

        <div className="relative">
          {book.img ? (
            <div className="relative">
              <img
                src={book.img} // Agar rasm bo'lmasa, default rasmni ko'rsatish
                alt="Uploaded"
                width={300}
                height={500}
                className="rounded-md shadow-md"
              />
              <button
                className="absolute bottom-4 right-4 cursor-pointer p-3 rounded-full shadow-lg"
                title="Change Image"
              >
                <span className="text-xl">
                  <PencilLine />
                </span>
                <input
                  type="file"
                  accept="image/*"
                  // onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full h-40 border-dashed border-2 border-gray-400 rounded-md">
              <label className="cursor-pointer text-gray-500">
                <span>Rasm yuklash</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="font-dancing text-4xl text-[#e8c282]">
            {book?.title}
          </h3>
          <p className="text-lg capitalize text-[#e8c282]">{book?.author}</p>
          <p className="text-sm text-gray-400">Sahifalar soni: {book?.pages}</p>
          <p className="text-sm text-gray-400">
            Chop etilgan yili: {book?.year}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <p className="text-md flex items-center gap-1 text-gray-400">
              To'liq ma'lumot <ArrowDown className="h-4 w-4" />
            </p>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            {book?.description}
          </p>

          <div className="flex w-full flex-col items-start">
            <p className="font-asd mb-[25px] mt-[36px] text-[16px] font-normal text-[#C9AC8C]">
              Mavjud format
            </p>

            <div className="flex w-full items-center justify-between">
              <div className="mt-2 flex gap-6">
                <div className="flex flex-col items-center gap-2 ">
                  <Book className="h-4 w-4 text-white" />
                  <p className="text-sm">Qog'oz kitob</p>
                  <p className="text-[14px] font-semibold text-gray-500">
                    {formatNumber(Number(book?.price))} so'm
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AudioLinesIcon className="h-4 w-4 text-white" />
                  <p className="text-sm">Audio kitob</p>
                  <p className="text-[14px] font-semibold text-gray-500">
                    Mavjud emas!
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <FaFilePdf className="h-4 w-4 text-white" />
                  <p className="text-sm">Elektron kitob</p>
                  <p className="text-[14px] font-semibold text-gray-500">
                    Mavjud emas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 O‘chirish tugmasi */}
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 text-black hover:bg-red-400 font-black tagesschrift-regular text-xl px-7 py-5 mr-28 mt-10">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="pb-3">Kitobni o‘chirish</DialogTitle>
              <DialogDescription className="pb-10">
                Ushbu kitobni o‘chirishga ishonchingiz komilmi?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline">Bekor qilish</Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500"
              >
                O‘chirish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default BookDetails;
