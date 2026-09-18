namespace server.Models;

public class Book
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? CoverImage { get; set; }

    public DateTime? ReleaseDate { get; set; }

    public string Status { get; set; } = "Coming Soon";

    public string? Genre { get; set; }

    public int? BookNumber { get; set; }

    public int? SeriesId { get; set; }

    public Series? Series { get; set; }

    public string? PurchaseUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ExtraContent> ExtraContent { get; set; } = new List<ExtraContent>();
}