import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export function generateItineraryPDF(packageData) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = 20

    // Header - Brand
    doc.setFontSize(24)
    doc.setTextColor(16, 185, 129) // Emerald color
    doc.text('WBTour', margin, yPos)

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Wahyu Bandung Tour', margin, yPos + 6)

    yPos += 20

    // Package Title
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text(packageData.title, margin, yPos)
    yPos += 10

    // Duration & City
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    doc.text(`${packageData.city} • ${packageData.days} Hari ${packageData.nights} Malam`, margin, yPos)
    yPos += 15

    // Highlights Section
    if (packageData.highlights && packageData.highlights.length > 0) {
        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text('Highlights:', margin, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        packageData.highlights.forEach((highlight, index) => {
            const bullet = `• ${highlight}`
            const lines = doc.splitTextToSize(bullet, pageWidth - margin * 2)
            lines.forEach(line => {
                if (yPos > 270) {
                    doc.addPage()
                    yPos = 20
                }
                doc.text(line, margin + 5, yPos)
                yPos += 5
            })
        })
        yPos += 10
    }

    // Itinerary Section
    if (packageData.itinerary && packageData.itinerary.length > 0) {
        if (yPos > 250) {
            doc.addPage()
            yPos = 20
        }

        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text('Itinerary:', margin, yPos)
        yPos += 10

        packageData.itinerary.forEach((dayActivities, dayIndex) => {
            if (yPos > 260) {
                doc.addPage()
                yPos = 20
            }

            // Day Header
            doc.setFontSize(12)
            doc.setFont(undefined, 'bold')
            doc.setTextColor(16, 185, 129)
            doc.text(`Hari ${dayIndex + 1}`, margin, yPos)
            yPos += 7

            // Activities
            doc.setFont(undefined, 'normal')
            doc.setFontSize(10)
            doc.setTextColor(60, 60, 60)

            if (Array.isArray(dayActivities)) {
                dayActivities.forEach(activity => {
                    const lines = doc.splitTextToSize(`• ${activity}`, pageWidth - margin * 2 - 5)
                    lines.forEach(line => {
                        if (yPos > 270) {
                            doc.addPage()
                            yPos = 20
                        }
                        doc.text(line, margin + 5, yPos)
                        yPos += 5
                    })
                })
            }
            yPos += 5
        })
    }

    // Include/Exclude Section
    if (yPos > 220) {
        doc.addPage()
        yPos = 20
    }

    if (packageData.includes && packageData.includes.length > 0) {
        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text('Include:', margin, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        packageData.includes.forEach(item => {
            if (yPos > 270) {
                doc.addPage()
                yPos = 20
            }
            doc.text(`✓ ${item}`, margin + 5, yPos)
            yPos += 5
        })
        yPos += 10
    }

    if (packageData.excludes && packageData.excludes.length > 0) {
        if (yPos > 250) {
            doc.addPage()
            yPos = 20
        }

        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text('Exclude:', margin, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        packageData.excludes.forEach(item => {
            if (yPos > 270) {
                doc.addPage()
                yPos = 20
            }
            doc.text(`✗ ${item}`, margin + 5, yPos)
            yPos += 5
        })
        yPos += 10
    }

    // Price Section
    if (yPos > 250) {
        doc.addPage()
        yPos = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Harga:', margin, yPos)
    yPos += 10

    if (packageData.priceOptions && packageData.priceOptions.length > 0) {
        doc.setFontSize(11)
        packageData.priceOptions.forEach(option => {
            doc.text(`${option.name}: Rp ${option.price.toLocaleString('id-ID')}`, margin + 5, yPos)
            yPos += 7
        })
    } else {
        doc.setFontSize(16)
        doc.setTextColor(16, 185, 129)
        doc.text(`Rp ${packageData.price.toLocaleString('id-ID')}`, margin + 5, yPos)
        yPos += 10
    }

    // Footer - Contact
    const footerY = doc.internal.pageSize.getHeight() - 20
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Hubungi Kami:', margin, footerY)
    doc.setTextColor(16, 185, 129)
    doc.text('WhatsApp: +62 822 2722 7039', margin, footerY + 5)
    doc.setTextColor(100, 100, 100)
    doc.text('Website: wahyubandungtour.com', margin, footerY + 10)

    // Save PDF
    const filename = `${packageData.slug || packageData.title.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`
    doc.save(filename)
}
