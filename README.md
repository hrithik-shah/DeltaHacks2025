Here's the improved README with refined language, better formatting, and consistent styling while keeping the content unchanged:  

---

# **DeltaHacks2025 - Deli Belly**  

**Deli Belly** is an innovative app that reduces food waste by helping users make the most of their groceries. Simply snap a picture of your grocery bill, and the app generates personalized recipe suggestions based on the ingredients purchased.  

---

## **Features**  

- **Snap and Upload**: Easily upload an image of your grocery bill.  
- **Recipe Suggestions**: Receive personalized recipe ideas tailored to the ingredients listed on your bill.  
- **Food Waste Reduction**: Discover creative ways to use what you already have, minimizing waste.  
- **User-Friendly Interface**: Enjoy a seamless and intuitive app experience.  

---

## **Tech Stack**  

- **Frontend**: Built with [Next.js](https://nextjs.org/) for a fast, scalable, and responsive web application.  
- **Backend**: Powered by [Flask](https://flask.palletsprojects.com/) for a lightweight and flexible backend.  
- **APIs**:  
  - [Cohere AI](https://cohere.ai/) for natural language processing and recipe generation.  
  - [Spoonacular](https://spoonacular.com/) for recipe data and ingredient suggestions.  

---

## **Installation**  

### 1. **Clone the Repository**  

```bash  
git clone https://github.com/hrithik-shah/DeltaHacks2025.git  
cd DeltaHacks2025  
```  

### 2. **Set Up the Frontend**  

- Install dependencies:  

```bash  
cd frontend  
npm install  
```  

- Start the Next.js development server:  

```bash  
npm run dev  
```  

### 3. **Set Up Environment Variables**  

Create a `config.env` file in `delly_belly/` and define the following keys:  
- `COHERE_API_KEY`  
- `SPOONACULAR_API_KEY`  

Ensure valid API keys for Cohere and Spoonacular are used.  

### 4. **Set Up the Backend**  

- Install dependencies:  

```bash  
cd backend  
pip install -r requirements.txt  
```  

- Start the Flask backend server:  

```bash  
python app.py  
```  

- Start the client development server in a separate terminal:  

```bash  
cd delly_belly/client  
npm run dev  
```  

---

## **How to Use**  

1. **Sign up or log in** to the app.  
2. **Snap a picture** of your grocery receipt and upload it.  
3. Receive a **list of recipes** generated from the ingredients on your bill.  
4. Start cooking and enjoy delicious meals while contributing to **food waste reduction**!  

---

## **Contributing**  

Contributions are always welcome! To help improve the project:  
1. Fork the repository.  
2. Make your changes.  
3. Submit a pull request.  

Ensure your code adheres to the existing style and includes appropriate tests.  

---

## **License**  

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  

---

## **Acknowledgements**  

- **Team Members**:  
  - [Akshay Tadi](https://github.com/AkshayTadi123)  
  - [Shaurya Suri](https://github.com/ShauryaSuri)  
- **DeltaHacks Mentors**: Thanks to the [DeltaHacks](https://www.deltahacks.com/) team for their invaluable guidance and support.  
- **API Providers**: Special thanks to **Cohere AI** and **Spoonacular** for enabling this project.  

---

This README now has a professional and polished look with enhanced clarity and readability. Let me know if there's anything else you'd like to refine!  
