import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Punch } from './punch.model';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'filterByBib',
  standalone: true
})
export class FilterByBibPipe implements PipeTransform {
  transform(items: Punch[], searchText: string): Punch[] {
    // Return all items if items array is null or empty
    if (!items || !searchText) return items || [];

    // Convert search text to lowercase and split by commas
    const searchQuery = searchText.toLowerCase().split(",").map(x => x.trim());
    const includeBibs = new Set<number>(); // Set to store bibs to include
    const excludeBibs = new Set<number>(); // Set to store bibs to exclude

    // Process each query in the search text
    searchQuery.forEach(query => {
      const isExclusion = query.startsWith("!"); // Check if the query is for exclusion
      const cleanQuery = isExclusion ? query.slice(1) : query; // Remove '!' for exclusion queries

      // Check if the query is a range
      if (cleanQuery.includes("-")) {
        const [start, end] = cleanQuery.split("-").map(Number); // Split the range into start and end
        for (let i = start; i <= end; i++) {
          isExclusion ? excludeBibs.add(i) : includeBibs.add(i); // Add each number in the range to the appropriate set
        }
      } else {
        const bib = Number(cleanQuery); // Convert the query to a number
        if (!isNaN(bib)) {
          isExclusion ? excludeBibs.add(bib) : includeBibs.add(bib); // Add the number to the appropriate set
        }
      }
    });

    // Filter the items based on the include and exclude sets
    return items.filter(item => {
      if (includeBibs.has(item.bib)) return true; // Always include bibs that are explicitly included
      if (excludeBibs.has(item.bib)) return false; // Exclude bibs that are explicitly excluded
      if (includeBibs.size > 0) return includeBibs.has(item.bib); // If there are any includeBibs specified, only include those
      return true; // Include all other bibs
    });
  }
}