
import { motion } from "framer-motion";

const partners = [
  { name: "GlobalRealty", logo: "https://placehold.co/200x80/f2f2f2/333333?text=GlobalRealty" },
  { name: "Finance Experts", logo: "https://placehold.co/200x80/f2f2f2/333333?text=FinanceExperts" },
  { name: "BuildTech", logo: "https://placehold.co/200x80/f2f2f2/333333?text=BuildTech" },
  { name: "TrustSecure", logo: "https://placehold.co/200x80/f2f2f2/333333?text=TrustSecure" },
  { name: "InnoInvest", logo: "https://placehold.co/200x80/f2f2f2/333333?text=InnoInvest" },
  { name: "AssetPro", logo: "https://placehold.co/200x80/f2f2f2/333333?text=AssetPro" }
];

const PartnersSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Trusted Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with industry leaders to deliver exceptional investment opportunities and secure returns for our investors.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-h-12 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
