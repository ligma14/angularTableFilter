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
    // Return all items if the items array is null, undefined, or empty
    if (!items || !searchText) return items || [];

    // Split the search text by commas, trim each part, and convert to lowercase
    const searchQuery = searchText.toLowerCase().split(",").map(x => x.trim());
    
    const includeBibs = new Set<number>(); // Set to store bib ranges to include
    const excludeBibs = new Set<number>(); // Set to store bib ranges to exclude
    const specificallyIncludedBibs = new Set<number>(); // Set to store individual bibs to include

    // Process each query segment
    searchQuery.forEach(query => {
      const isExclusion = query.startsWith("!"); // Determine if it's an exclusion
      const cleanQuery = isExclusion ? query.slice(1) : query; // Remove '!' for exclusions

      // Check if the query specifies a range
      if (cleanQuery.includes("-")) {
        const [start, end] = cleanQuery.split("-").map(Number); // Extract start and end of the range
        if (!isNaN(start) && !isNaN(end) && start <= end) { // Validate the range
          for (let i = start; i <= end; i++) {
            if (isExclusion) {
              excludeBibs.add(i); // Add to exclusion range
            } else {
              includeBibs.add(i); // Add to inclusion range
            }
          }
        }
      } else {
        const bib = Number(cleanQuery); // Convert the query to a number
        if (!isNaN(bib)) {
          if (isExclusion) {
            excludeBibs.add(bib); // Add to exclusion set
          } else {
            specificallyIncludedBibs.add(bib); // Add to individual inclusion set
          }
        }
      }
    });

    // Filter the items based on the include and exclude sets
    return items.filter(item => {
      const bib = item.bib;

      // 1. If the bib is explicitly included, include it regardless of exclusions
      if (specificallyIncludedBibs.has(bib)) return true;

      // 2. If the bib is explicitly excluded, exclude it
      if (excludeBibs.has(bib)) return false;

      // 3. If there are any includeBibs specified, include only those
      if (includeBibs.size > 0) return includeBibs.has(bib);

      // 4. If no inclusions are specified, include all bibs
      return true;
    });
  }
}