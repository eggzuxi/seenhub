"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../../../hooks/useAuth";

const genres = ["Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance", "Fantasy", "SF", "Horror", "Adventure", "Historical Fiction", "Biography", "Autobiography", "Self-Help", "Health & Wellness", "Psychology", "Philosophy", "Science", "Business", "Politics", "Religion & Spirituality", "Cookbook", "Educational"]

function AddBookPage() {

    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/book");
        }
    }, [user, authLoading, router]);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            genre: checked ? [...prev.genre, value] : prev.genre.filter((g) => g !== value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            // 도서 추가 요청 (리뷰 ID는 있을 때만 포함)
            const bookResponse = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    genre: formData.genre,
                }),
            });

            if (!bookResponse.ok) throw new Error("fail to add book");

            alert("successfully added book");

            // 폼 초기화
            setFormData({ title: "", author: "", genre: [] });

            // 자동으로 book 페이지로 이동
            router.push("/book");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-10">
            <h1 className="text-2xl font-bold mb-4">Add Book</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                    required
                />
                <input
                    type="text"
                    name="author"
                    placeholder="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                    required
                />
                <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                        <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                value={genre}
                                checked={formData.genre.includes(genre)}
                                onChange={handleGenreChange}
                                className="w-4 h-4 border border-gray-400 rounded-sm bg-transparent accent-white"
                            />
                            <span>{genre}</span>
                        </label>
                    ))}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                    disabled={loading}
                >
                    {loading ? "adding..." : "ADD"}
                </button>
            </form>
        </div>
    );
}

export default AddBookPage;