import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BooksList() {
  const [loading, setLoading] = useState(false);
  const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    page: 0,
    year: 0,
    price: 0,
    country: "",
    author: "",
    description: "",
  });

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateUniqueId = (() => {
    const generatedIds = new Set();

    return function (length = 10) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let id;

      do {
        id = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          id += chars[randomIndex];
        }
      } while (generatedIds.has(id));

      generatedIds.add(id);
      return id;
    };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanedForm = {
      title: form.title,
      pages: Number(form.page),
      year: Number(form.year.slice(0, 4)),
      price: Number(form.price),
      country: form.country,
      author: form.author,
      description: form.description,
    };

    let createdBookId = null;

    try {
      const res = await fetch("https://library-1dmu.onrender.com/add_book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedForm),
      });

      const data = await res.json();
      createdBookId = data?.id || generateUniqueId();
      console.log("Kitob qo‘shildi:", createdBookId);
    } catch (err) {
      console.error("Kitobni yaratishda xatolik", err);
      setLoading(false);
      return;
    }

    const uploadImage = async (image) => {
      if (image && createdBookId) {
        const formData = new FormData();
        formData.append("image", image);

        const token = localStorage.getItem("token");

        try {
          const res = await fetch(
            `https://library-1dmu.onrender.com/upload/book/${createdBookId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          const imgRes = await res.json();
          console.log("Rasm yuklandi:", imgRes);
        } catch (err) {
          console.error("Rasm yuklashda xatolik:", err);
        }
      }
    };

    await uploadImage(image);

    setLoading(false);
  };

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("https://library-1dmu.onrender.com/get_books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API xatosi:", error);
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  if (loading)
    return (
      <div className="flex h-screen items-center text-white">
        <Button className="mx-auto flex items-center" disabled>
          <Loader2 className="animate-spin" />
          Ma'lumotlar yuklanmoqda...
        </Button>
      </div>
    );

  return (
    <div className="p-5 px-20">
      <div className="flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="border-2 border-gray-900 text-black hover:text-black shadow-lg shadow-gray-400/50 dark:border-gray-900 dark:shadow-gray-800/50 dark:text-black p-3 px-4 mb-8"
            >
              <Plus />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-2xl overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl">Add Book</SheetTitle>
                <SheetDescription>
                  Kitob qo'shish uchun ma'lumotlarni to'ldiring
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Upload cover
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleInput}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="page" className="text-right">
                    Pages
                  </Label>
                  <Input
                    id="page"
                    name="page"
                    value={form.page}
                    onChange={handleInput}
                    type="number"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
                  </Label>
                  <Input
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleInput}
                    type="date"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    value={form.price}
                    onChange={handleInput}
                    type="number"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="country" className="text-right">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleInput}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    value={form.author}
                    onChange={handleInput}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    placeholder="Kitob haqida ma'lumot..."
                    className="col-span-3 min-h-[80px]"
                  />
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Yuklanmoqda..." : "Create"}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div>
        <ul className="mt-5 grid grid-cols-6 justify-center gap-5 space-y-2 px-20">
          {books?.map((book) => (
            <li
              key={book?._id}
              className="mt-2 w-[200px] transform cursor-pointer overflow-hidden rounded-lg p-4 shadow-md transition-transform hover:scale-105"
              onClick={() => navigate(`/book/${book._id}`)}
            >
              <img
                src={book?.img}
                alt={book?.title}
                className="h-60 w-full rounded-lg object-cover"
              />
              <h3 className="mt-2 font-dancing text-[20px] font-normal uppercase">
                {book?.title}
              </h3>
              <p className="text-[12px] font-light capitalize text-gray-600">
                {book?.author}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BooksList;
