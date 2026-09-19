using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/books
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookResponse>>> GetBooks()
    {
        var books = await _context.Books
            .Include(book => book.Series)
            .OrderBy(book => book.BookNumber)
            .ThenBy(book => book.Title)
            .Select(book => new BookResponse
            {
                Id = book.Id,
                Title = book.Title,
                Slug = book.Slug,
                Description = book.Description,
                CoverImage = book.CoverImage,
                ReleaseDate = book.ReleaseDate,
                Status = book.Status,
                Genre = book.Genre,
                BookNumber = book.BookNumber,
                SeriesId = book.SeriesId,
                SeriesName = book.Series != null ? book.Series.Name : null,
                PurchaseUrl = book.PurchaseUrl
            })
            .ToListAsync();

        return Ok(books);
    }

    // GET: api/books/{slug}
    [HttpGet("{slug}")]
    public async Task<ActionResult<BookResponse>> GetBook(string slug)
    {
        var book = await _context.Books
            .Include(book => book.Series)
            .Where(book => book.Slug == slug)
            .Select(book => new BookResponse
            {
                Id = book.Id,
                Title = book.Title,
                Slug = book.Slug,
                Description = book.Description,
                CoverImage = book.CoverImage,
                ReleaseDate = book.ReleaseDate,
                Status = book.Status,
                Genre = book.Genre,
                BookNumber = book.BookNumber,
                SeriesId = book.SeriesId,
                SeriesName = book.Series != null ? book.Series.Name : null,
                PurchaseUrl = book.PurchaseUrl
            })
            .FirstOrDefaultAsync();

        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }

    // POST: api/books
    [Authorize(Roles = "Admin")]
[HttpPost]
public async Task<ActionResult<BookResponse>> CreateBook(BookRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _context.Books.AnyAsync(book => book.Slug == slug);

        if (slugExists)
        {
            return Conflict(new
            {
                message = "A book with this slug already exists."
            });
        }

        var book = new Book
        {
            Title = request.Title.Trim(),
            Slug = slug,
            Description = request.Description,
            CoverImage = request.CoverImage,
            ReleaseDate = request.ReleaseDate,
            Status = request.Status,
            Genre = request.Genre,
            BookNumber = request.BookNumber,
            SeriesId = request.SeriesId,
            PurchaseUrl = request.PurchaseUrl
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        await _context.Entry(book)
            .Reference(b => b.Series)
            .LoadAsync();

        return CreatedAtAction(
            nameof(GetBook),
            new { slug = book.Slug },
            ToResponse(book)
        );
    }

    // PUT: api/books/{id}
    [Authorize(Roles = "Admin")]
[HttpPut("{id:int}")]
public async Task<ActionResult<BookResponse>> UpdateBook(
        int id,
        BookRequest request)
    {
        var book = await _context.Books
            .Include(book => book.Series)
            .FirstOrDefaultAsync(book => book.Id == id);

        if (book == null)
        {
            return NotFound();
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _context.Books
            .AnyAsync(existing =>
                existing.Slug == slug &&
                existing.Id != id);

        if (slugExists)
        {
            return Conflict(new
            {
                message = "A book with this slug already exists."
            });
        }

        book.Title = request.Title.Trim();
        book.Slug = slug;
        book.Description = request.Description;
        book.CoverImage = request.CoverImage;
        book.ReleaseDate = request.ReleaseDate;
        book.Status = request.Status;
        book.Genre = request.Genre;
        book.BookNumber = request.BookNumber;
        book.SeriesId = request.SeriesId;
        book.PurchaseUrl = request.PurchaseUrl;
        book.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _context.Entry(book)
            .Reference(b => b.Series)
            .LoadAsync();

        return Ok(ToResponse(book));
    }

    // DELETE: api/books/{id}
    [Authorize(Roles = "Admin")]
[HttpDelete("{id:int}")]
public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static BookResponse ToResponse(Book book)
    {
        return new BookResponse
        {
            Id = book.Id,
            Title = book.Title,
            Slug = book.Slug,
            Description = book.Description,
            CoverImage = book.CoverImage,
            ReleaseDate = book.ReleaseDate,
            Status = book.Status,
            Genre = book.Genre,
            BookNumber = book.BookNumber,
            SeriesId = book.SeriesId,
            SeriesName = book.Series?.Name,
            PurchaseUrl = book.PurchaseUrl
        };
    }

    private static string GenerateSlug(string title)
    {
        return title
            .Trim()
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "");
    }
}

public class BookRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Slug { get; set; }

    public string? Description { get; set; }

    public string? CoverImage { get; set; }

    public DateTime? ReleaseDate { get; set; }

    public string Status { get; set; } = "Coming Soon";

    public string? Genre { get; set; }

    public int? BookNumber { get; set; }

    public int? SeriesId { get; set; }

    public string? PurchaseUrl { get; set; }
}

public class BookResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? CoverImage { get; set; }

    public DateTime? ReleaseDate { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? Genre { get; set; }

    public int? BookNumber { get; set; }

    public int? SeriesId { get; set; }

    public string? SeriesName { get; set; }

    public string? PurchaseUrl { get; set; }
}