import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Review } from "../types";
import reviewsData from "../data/reviews.json";

interface CustomerReviewsProps {
  t: (key: string) => string;
}

export default function CustomerReviews({ t }: CustomerReviewsProps) {
  const [reviews] = useState<Review[]>(reviewsData);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <section className="py-16 bg-background" data-testid="customer-reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" data-testid="reviews-title">
            Ce que disent nos clients
          </h2>
          <p className="text-muted-foreground" data-testid="reviews-subtitle">
            Plus de 15,000 clients satisfaits
          </p>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out space-x-6"
            style={{ transform: `translateX(-${currentIndex * 320}px)` }}
            data-testid="reviews-carousel"
          >
            {reviews.map((review) => (
              <div key={review.id} className="min-w-80 bg-card rounded-lg p-6" data-testid={`review-card-${review.id}`}>
                <div className="flex items-center mb-4">
                  <div className="flex text-accent" data-testid={`review-stars-${review.id}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground" data-testid={`review-rating-${review.id}`}>
                    {review.rating}/5
                  </span>
                </div>
                
                <p className="text-foreground mb-4" data-testid={`review-comment-${review.id}`}>
                  "{review.comment}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold" data-testid={`review-avatar-${review.id}`}>
                    {review.avatar}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold" data-testid={`review-name-${review.id}`}>
                      {review.name}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`review-city-${review.id}`}>
                      {review.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
