using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Book> Books => Set<Book>();

    public DbSet<Series> Series => Set<Series>();

    public DbSet<ExtraContent> ExtraContent => Set<ExtraContent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Book>()
            .HasIndex(book => book.Slug)
            .IsUnique();

        modelBuilder.Entity<Series>()
            .HasIndex(series => series.Slug)
            .IsUnique();

        modelBuilder.Entity<ExtraContent>()
            .HasIndex(content => new { content.BookId, content.Slug })
            .IsUnique();

        modelBuilder.Entity<Book>()
            .HasOne(book => book.Series)
            .WithMany(series => series.Books)
            .HasForeignKey(book => book.SeriesId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ExtraContent>()
            .HasOne(content => content.Book)
            .WithMany(book => book.ExtraContent)
            .HasForeignKey(content => content.BookId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}