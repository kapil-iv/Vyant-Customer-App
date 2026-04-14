import { useEffect, useState } from "react";
import { fetchReviewsApi } from "../reviewApi";

export function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviewsApi(productId).then(setReviews).catch(() => setReviews([]));
  }, [productId]);

  return (
    <article className="rounded border bg-vy-surface p-3">
      <h3 className="font-semibold">Reviews</h3>
      <div className="mt-2 space-y-2 text-sm">
        {reviews.map((r, idx) => (
          <div key={r._id ?? idx} className="rounded border p-2">
            <p className="font-medium">{r.authorName ?? r.user?.name ?? "Customer"}</p>
            <p>{r.comment ?? r.review ?? ""}</p>
          </div>
        ))}
        {!reviews.length ? <p className="text-vy-muted">No reviews yet.</p> : null}
      </div>
    </article>
  );
}
