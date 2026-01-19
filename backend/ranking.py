import trueskill
from . import models

# Initialize TrueSkill environment
env = trueskill.TrueSkill(mu=25.0, sigma=8.333, beta=4.167, tau=0.083, draw_probability=0.0)

def update_ratings(winner: models.Wallpaper, loser: models.Wallpaper):
    winner_rating = env.create_rating(mu=winner.rating_mu, sigma=winner.rating_sigma)
    loser_rating = env.create_rating(mu=loser.rating_mu, sigma=loser.rating_sigma)

    new_winner_rating, new_loser_rating = env.rate_1vs1(winner_rating, loser_rating)

    winner.rating_mu = new_winner_rating.mu
    winner.rating_sigma = new_winner_rating.sigma
    loser.rating_mu = new_loser_rating.mu
    loser.rating_sigma = new_loser_rating.sigma

    return winner, loser
